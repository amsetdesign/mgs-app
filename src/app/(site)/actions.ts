"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { after } from "next/server";
import { notifyTeam, sendMail } from "@/lib/mail";
import { formatPrice } from "@/lib/format";
import { publicClient } from "@/lib/supabase/public";
import { hasSupabase } from "@/lib/supabase/env";
import { getEventsOnDay } from "@/lib/data";
import { uploadImage } from "@/lib/r2";
import { PROJECT_TYPES, EVENT_CATEGORIES } from "@/lib/labels";
import { PACKS, SITE } from "@/lib/site";

export type FormState = { ok: boolean; message?: string; error?: string; fields?: Record<string, string> };

const OFFLINE: FormState = { ok: false, error: "Le formulaire n'est pas encore relié à la base. Réessayez plus tard." };

// Limitation simple par adresse IP (mémoire de l'instance) : 6 envois par tranche de 10 minutes
const hits = new Map<string, number[]>();
async function tooMany(scope: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 6;
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const isBot = (fd: FormData) => str(fd, "website") !== "";
const firstError = (e: z.ZodError) => e.issues[0]?.message ?? "Vérifiez le formulaire.";

const email = z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(160);
const phone = z.string().trim().min(6, "Numéro de téléphone invalide.").max(40).regex(/^[+0-9 ().-]+$/, "Numéro de téléphone invalide.");
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "Lien invalide : il doit commencer par https://");

// ===== Newsletter =====
export async function subscribeNewsletter(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true, message: "Merci, vous êtes inscrit." };
  const parsed = email.safeParse(str(fd, "email"));
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  if (!hasSupabase) return OFFLINE;
  if (await tooMany("newsletter")) return { ok: false, error: "Trop de tentatives. Réessayez dans quelques minutes." };
  const { error } = await publicClient().from("newsletter_subscribers").insert({ email: parsed.data, source: str(fd, "source").slice(0, 40) || "site" });
  if (error && error.code !== "23505") return { ok: false, error: "L'inscription a échoué. Réessayez." };
  return { ok: true, message: error ? "Vous êtes déjà inscrit. Merci !" : "Merci, vous êtes inscrit. Les prochaines sorties arrivent dans votre boîte." };
}

// ===== Contact =====
const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom.").max(120),
  email,
  phone: z.string().trim().max(40),
  subject: z.enum(["contact", "partenariat", "presse", "autre"]),
  message: z.string().trim().min(5, "Votre message est trop court.").max(4000, "Message trop long (4 000 caractères maximum)."),
});

export async function sendContact(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true, message: "Message envoyé." };
  const parsed = contactSchema.safeParse({ name: str(fd, "name"), email: str(fd, "email"), phone: str(fd, "phone"), subject: str(fd, "subject") || "contact", message: str(fd, "message") });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  if (!hasSupabase) return OFFLINE;
  if (await tooMany("contact")) return { ok: false, error: "Trop de messages envoyés. Réessayez dans quelques minutes." };
  const { error } = await publicClient().from("contact_messages").insert(parsed.data);
  if (error) return { ok: false, error: "L'envoi a échoué. Réessayez ou écrivez-nous par e-mail." };
  const m = parsed.data;
  after(() => notifyTeam(`Message de ${m.name}`, {
    title: "Nouveau message depuis le site",
    paragraphs: [m.message],
    rows: [["Nom", m.name], ["E-mail", m.email], ["Téléphone", m.phone || "–"], ["Sujet", m.subject]],
    cta: { label: "Voir dans l'administration", href: `${SITE.url}/admin/messages` },
  }, m.email));
  return { ok: true, message: "Merci, votre message est bien arrivé. L'équipe MGS vous répond rapidement." };
}

// ===== Soumission de projet =====
const submissionSchema = z.object({
  artist_name: z.string().trim().min(2, "Indiquez le nom de l'artiste ou du groupe.").max(120),
  phone,
  email,
  country: z.string().trim().min(2, "Indiquez votre pays.").max(60),
  socials: z.string().trim().max(500),
  project_type: z.enum(Object.keys(PROJECT_TYPES) as [keyof typeof PROJECT_TYPES, ...(keyof typeof PROJECT_TYPES)[]], { message: "Choisissez le type de projet." }),
  title: z.string().trim().min(2, "Indiquez le titre du projet.").max(160),
  release_date: z.string().trim().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Date de sortie invalide."),
  description: z.string().trim().max(4000, "Description trop longue (4 000 caractères maximum)."),
  youtube_url: optionalUrl,
  download_url: optionalUrl,
  pack: z.enum(PACKS.map((p) => p.id) as [string, ...string[]], { message: "Choisissez un pack." }),
});

export async function submitProject(_prev: FormState, fd: FormData): Promise<FormState> {
  const raw = Object.fromEntries(
    ["artist_name", "phone", "email", "country", "socials", "project_type", "title", "release_date", "description", "youtube_url", "download_url", "pack"].map((k) => [k, str(fd, k)]),
  );
  if (isBot(fd)) return { ok: true, message: "Projet reçu." };
  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error), fields: raw };
  if (fd.get("consent") !== "on") return { ok: false, error: "Confirmez que vous détenez les droits sur ce projet.", fields: raw };
  if (!hasSupabase) return { ...OFFLINE, fields: raw };
  if (await tooMany("submission")) return { ok: false, error: "Trop d'envois. Réessayez dans quelques minutes.", fields: raw };

  const visual = await uploadImage(fd.get("visual") as File | null, "submissions");
  if (visual && "error" in visual) return { ok: false, error: visual.error, fields: raw };

  const { error } = await publicClient()
    .from("submissions")
    .insert({ ...parsed.data, release_date: parsed.data.release_date || null, visual_url: visual?.url ?? "" });
  if (error) return { ok: false, error: "L'envoi a échoué. Réessayez ou contactez-nous.", fields: raw };

  const pack = PACKS.find((p) => p.id === parsed.data.pack)!;
  const d = parsed.data;
  after(async () => {
    await notifyTeam(`Projet soumis : ${d.title} (${pack.name})`, {
      title: `${d.artist_name} a soumis « ${d.title} »`,
      paragraphs: [d.description || "Pas de description."],
      rows: [
        ["Pack", `${pack.name} · ${formatPrice(pack.price)}`], ["Type", PROJECT_TYPES[d.project_type]], ["Sortie", d.release_date || "–"],
        ["Téléphone", d.phone], ["E-mail", d.email], ["Pays", d.country], ["YouTube", d.youtube_url || "–"], ["Écoute", d.download_url || "–"], ["Réseaux", d.socials || "–"],
      ],
      cta: { label: "Traiter le projet", href: `${SITE.url}/admin/soumissions` },
    }, d.email);
    await sendMail(d.email, "Votre projet est bien arrivé chez MGS", {
      title: `Merci ${d.artist_name}, votre projet est bien arrivé`,
      paragraphs: pack.price === 0
        ? [`L'équipe Music Gospel Sénégal va écouter « ${d.title} » et vous recontacter avant sa publication.`]
        : [
          `Vous avez choisi le pack ${pack.name} (${formatPrice(pack.price)}). L'équipe vérifie « ${d.title} » puis vous contacte pour le calendrier de diffusion.`,
          `Paiement par Wave ou Orange Money au ${SITE.payment.wave}, au nom de ${SITE.payment.holder}. Indiquez le titre du projet dans le message du paiement.`,
        ],
      cta: { label: "Nous écrire sur WhatsApp", href: `https://wa.me/${SITE.whatsapp}` },
    }, SITE.email);
  });
  return {
    ok: true,
    message: pack.price === 0
      ? "Projet reçu. L'équipe MGS le vérifie et vous recontacte avant publication."
      : `Projet reçu avec le pack ${pack.name}. L'équipe MGS vous contacte pour le paiement et le calendrier de diffusion.`,
    fields: { pack: pack.id },
  };
}

// ===== Annonce d'événement =====
const eventSchema = z.object({
  title: z.string().trim().min(3, "Indiquez le nom de l'événement.").max(140),
  organizer: z.string().trim().min(2, "Indiquez l'organisateur.").max(120),
  category: z.enum(Object.keys(EVENT_CATEGORIES) as [keyof typeof EVENT_CATEGORIES, ...(keyof typeof EVENT_CATEGORIES)[]], { message: "Choisissez une catégorie." }),
  city: z.string().trim().min(2, "Indiquez la ville.").max(80),
  country: z.string().trim().min(2).max(60),
  venue: z.string().trim().max(160),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Indiquez la date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Indiquez l'heure."),
  description: z.string().trim().max(4000, "Description trop longue."),
  contact_phone: z.string().trim().max(40),
  contact_email: z.union([z.literal(""), email]),
  ticket_url: optionalUrl,
});

export async function submitEvent(_prev: FormState, fd: FormData): Promise<FormState> {
  const keys = ["title", "organizer", "category", "city", "country", "venue", "date", "time", "description", "contact_phone", "contact_email", "ticket_url"];
  const raw = Object.fromEntries(keys.map((k) => [k, str(fd, k)]));
  if (!raw.country) raw.country = "Sénégal";
  if (isBot(fd)) return { ok: true, message: "Événement reçu." };
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error), fields: raw };
  const { date, time, ...rest } = parsed.data;
  // heure saisie = heure de Dakar (UTC+0 toute l'année)
  const startsAt = new Date(`${date}T${time}:00Z`);
  if (startsAt.getTime() < Date.now() - 24 * 3600 * 1000) return { ok: false, error: "La date de l'événement est déjà passée.", fields: raw };
  if (!rest.contact_phone && !rest.contact_email) return { ok: false, error: "Laissez au moins un téléphone ou un e-mail de contact.", fields: raw };
  if (!hasSupabase) return { ...OFFLINE, fields: raw };
  if (await tooMany("event")) return { ok: false, error: "Trop d'envois. Réessayez dans quelques minutes.", fields: raw };

  const poster = await uploadImage(fd.get("poster") as File | null, "events");
  if (poster && "error" in poster) return { ok: false, error: poster.error, fields: raw };

  const { error } = await publicClient().from("events").insert({ ...rest, starts_at: startsAt.toISOString(), poster_url: poster?.url ?? "" });
  if (error) return { ok: false, error: "L'envoi a échoué. Réessayez ou contactez-nous.", fields: raw };
  after(() => notifyTeam(`Événement à valider : ${rest.title}`, {
    title: `${rest.organizer} annonce « ${rest.title} »`,
    paragraphs: [rest.description || "Pas de description."],
    rows: [["Date", `${date} à ${time}`], ["Lieu", [rest.venue, rest.city, rest.country].filter(Boolean).join(", ")], ["Contact", [rest.contact_phone, rest.contact_email].filter(Boolean).join(" · ")]],
    cta: { label: "Valider l'événement", href: `${SITE.url}/admin/evenements` },
  }, rest.contact_email || undefined));
  return { ok: true, message: "Événement reçu. L'équipe MGS le vérifie avant de l'ajouter au calendrier gospel." };
}

/** Vérifie les événements déjà annoncés le même jour, pendant la saisie du formulaire. */
export async function eventsOnDay(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return [];
  return getEventsOnDay(day);
}
