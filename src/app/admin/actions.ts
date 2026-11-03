"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { uploadImage } from "@/lib/r2";
import { slugify } from "@/lib/format";
import { ARTICLE_CATEGORIES, SUBMISSION_STATUS } from "@/lib/labels";

export type AdminState = { ok?: boolean; error?: string; message?: string };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

// ===== Projets soumis =====
export async function updateSubmission(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, log } = await requireAdmin();
  const status = str(fd, "status");
  if (!(status in SUBMISSION_STATUS)) return { error: "Statut inconnu." };
  const { error } = await supabase
    .from("submissions")
    .update({ status, payment_ref: str(fd, "payment_ref").slice(0, 120), admin_note: str(fd, "admin_note").slice(0, 2000) })
    .eq("id", str(fd, "id"));
  if (error) return { error: "Enregistrement impossible." };
  await log("projet_statut", "submission", str(fd, "id"), SUBMISSION_STATUS[status as keyof typeof SUBMISSION_STATUS]);
  revalidatePath("/admin/soumissions");
  revalidatePath("/admin");
  return { ok: true, message: "Enregistré." };
}

// ===== Événements =====
export async function reviewEvent(fd: FormData) {
  const { supabase, log } = await requireAdmin();
  const approve = str(fd, "decision") === "approve";
  await supabase
    .from("events")
    .update({ status: approve ? "approved" : "rejected", review_note: approve ? "" : str(fd, "note").slice(0, 500) })
    .eq("id", str(fd, "id"));
  await log(approve ? "evenement_publie" : "evenement_refuse", "event", str(fd, "id"), str(fd, "note"));
  revalidatePath("/admin/evenements");
  revalidatePath("/evenements");
  revalidatePath("/");
}

export async function deleteEvent(fd: FormData) {
  const { supabase, log } = await requireAdmin();
  await supabase.from("events").delete().eq("id", str(fd, "id"));
  await log("evenement_retire", "event", str(fd, "id"));
  revalidatePath("/admin/evenements");
  revalidatePath("/evenements");
  revalidatePath("/");
}

// ===== Articles =====
const articleSchema = z.object({
  title: z.string().trim().min(3, "Titre trop court.").max(160),
  slug: z.string().trim().max(120),
  excerpt: z.string().trim().max(300, "Chapô trop long (300 caractères maximum)."),
  body: z.string().trim().max(60000),
  category: z.enum(Object.keys(ARTICLE_CATEGORIES) as [string, ...string[]]),
  artist_id: z.string().trim(),
  status: z.enum(["draft", "published"]),
});

export async function saveArticle(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, userId, log } = await requireAdmin();
  const id = str(fd, "id");
  const parsed = articleSchema.safeParse({
    title: str(fd, "title"), slug: str(fd, "slug"), excerpt: str(fd, "excerpt"), body: str(fd, "body"),
    category: str(fd, "category"), artist_id: str(fd, "artist_id"), status: str(fd, "status") || "draft",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Vérifiez le formulaire." };
  const data = parsed.data;

  const cover = await uploadImage(fd.get("cover") as File | null, "articles");
  if (cover && "error" in cover) return { error: cover.error };

  const slug = slugify(data.slug || data.title).slice(0, 120) || `article-${Date.now()}`;
  const row: Record<string, unknown> = {
    title: data.title, slug, excerpt: data.excerpt, body: data.body, category: data.category,
    artist_id: data.artist_id || null, status: data.status,
  };
  if (cover) row.cover_url = cover.url;
  if (str(fd, "remove_cover") === "on") row.cover_url = "";

  if (id) {
    const { data: current } = await supabase.from("articles").select("published_at").eq("id", id).maybeSingle();
    if (data.status === "published" && !current?.published_at) row.published_at = new Date().toISOString();
    const { error } = await supabase.from("articles").update(row).eq("id", id);
    if (error) return { error: error.code === "23505" ? "Cette adresse (slug) est déjà utilisée par un autre article." : "Enregistrement impossible." };
  } else {
    row.author_id = userId;
    if (data.status === "published") row.published_at = new Date().toISOString();
    const { error } = await supabase.from("articles").insert(row);
    if (error) return { error: error.code === "23505" ? "Cette adresse (slug) est déjà utilisée par un autre article." : "Enregistrement impossible." };
  }
  await log(id ? "article_modifie" : "article_cree", "article", id, data.title);
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(fd: FormData) {
  const { supabase, log } = await requireAdmin();
  await supabase.from("articles").delete().eq("id", str(fd, "id"));
  await log("article_supprime", "article", str(fd, "id"));
  revalidatePath("/actualites");
  revalidatePath("/");
  redirect("/admin/articles");
}

// ===== Titres envoyés depuis l'application =====
export async function reviewSong(fd: FormData) {
  const { supabase } = await requireAdmin(); // tracé par la base (validation des titres)
  await supabase.rpc("review_song", { p_song: str(fd, "id"), p_approve: str(fd, "decision") === "approve", p_note: str(fd, "note").slice(0, 500) });
  revalidatePath("/admin/titres");
  revalidatePath("/");
}

// ===== Artistes =====
const urlOrEmpty = z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "Les liens des réseaux doivent commencer par https://");

export async function updateArtist(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, log } = await requireAdmin();
  const id = str(fd, "id");
  const userId = str(fd, "user_id");
  const socials = z.object({ social_facebook: urlOrEmpty, social_instagram: urlOrEmpty, social_tiktok: urlOrEmpty, social_youtube: urlOrEmpty }).safeParse({
    social_facebook: str(fd, "social_facebook"), social_instagram: str(fd, "social_instagram"), social_tiktok: str(fd, "social_tiktok"), social_youtube: str(fd, "social_youtube"),
  });
  if (!socials.success) return { error: socials.error.issues[0]?.message };
  const name = str(fd, "full_name");
  if (name.length < 2) return { error: "Indiquez le nom de l'artiste." };

  const photo = await uploadImage(fd.get("avatar") as File | null, "artists");
  if (photo && "error" in photo) return { error: photo.error };

  const { error: e1 } = await supabase
    .from("artists")
    .update({ ...socials.data, bio: str(fd, "bio").slice(0, 5000), featured: fd.get("featured") === "on", verified: fd.get("verified") === "on" })
    .eq("id", id);
  const profile: Record<string, string> = { full_name: name.slice(0, 80), country: str(fd, "country").slice(0, 60) };
  if (photo) profile.avatar_url = photo.url;
  const { error: e2 } = await supabase.from("profiles").update(profile).eq("id", userId);
  if (e1 || e2) return { error: "Enregistrement impossible." };

  const { data } = await supabase.from("artists").select("slug").eq("id", id).maybeSingle();
  await log("artiste_modifie", "artist", id, name);
  revalidatePath("/artistes");
  if (data?.slug) revalidatePath(`/artistes/${data.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/artistes");
  return { ok: true, message: "Fiche artiste enregistrée." };
}

// ===== Messages =====
export async function toggleMessage(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("contact_messages").update({ handled: str(fd, "handled") === "true" }).eq("id", str(fd, "id"));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

// ===== Fiches artistes créées par l'équipe =====
export async function createArtist(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, log } = await requireAdmin();
  const name = str(fd, "full_name");
  if (name.length < 2) return { error: "Indiquez le nom de l'artiste." };
  const photo = await uploadImage(fd.get("avatar") as File | null, "artists");
  if (photo && "error" in photo) return { error: photo.error };
  const { error } = await supabase.rpc("admin_create_artist", {
    p_name: name.slice(0, 80),
    p_country: str(fd, "country").slice(0, 60) || "Sénégal",
    p_bio: str(fd, "bio").slice(0, 5000),
    p_avatar: photo?.url ?? "",
    p_featured: fd.get("featured") === "on",
  });
  if (error) return { error: "Création impossible. Vérifiez que le fichier SQL « MGS - 7 » a été exécuté." };
  await log("artiste_cree", "artist", "", name);
  revalidatePath("/artistes");
  revalidatePath("/");
  revalidatePath("/admin/artistes");
  return { ok: true, message: `Fiche de ${name} créée.` };
}

const LINK_ERRORS: Record<string, string> = {
  account_not_found: "Aucun compte de l'application n'utilise cet e-mail. L'artiste doit d'abord s'inscrire dans l'app.",
  not_claimable: "Cette fiche est déjà reliée à un compte.",
  target_has_songs: "Ce compte a déjà son propre espace artiste avec des titres : contactez le support technique.",
};

export async function linkArtist(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, log } = await requireAdmin();
  const email = str(fd, "email").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Adresse e-mail invalide." };
  const { error } = await supabase.rpc("admin_link_artist", { p_artist: str(fd, "id"), p_email: email });
  if (error) {
    const code = Object.keys(LINK_ERRORS).find((k) => error.message.includes(k));
    return { error: code ? LINK_ERRORS[code] : "Rattachement impossible." };
  }
  await log("artiste_rattache", "artist", str(fd, "id"), email);
  revalidatePath("/admin/artistes");
  revalidatePath("/artistes");
  return { ok: true, message: "Fiche rattachée : l'artiste la gère maintenant depuis l'application." };
}

// ===== Catalogue =====
export async function updateSong(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, log } = await requireAdmin();
  const title = str(fd, "title");
  if (title.length < 1) return { error: "Le titre est obligatoire." };
  const cover = await uploadImage(fd.get("cover") as File | null, "artists");
  if (cover && "error" in cover) return { error: cover.error };
  const row: Record<string, unknown> = { title: title.slice(0, 160), genre: str(fd, "genre").slice(0, 40) || "Gospel" };
  if (cover) row.cover_url = cover.url;
  const { error } = await supabase.from("songs").update(row).eq("id", str(fd, "id"));
  if (error) return { error: "Enregistrement impossible." };
  await log("titre_modifie", "song", str(fd, "id"), title);
  revalidatePath("/admin/catalogue");
  revalidatePath("/");
  return { ok: true, message: "Titre enregistré." };
}

export async function songAction(fd: FormData) {
  const { supabase, log } = await requireAdmin();
  const id = str(fd, "id");
  switch (str(fd, "do")) {
    case "publish":
      await supabase.from("songs").update({ is_published: true, review_status: "approved", review_note: "" }).eq("id", id);
      break;
    case "unpublish":
      await supabase.from("songs").update({ is_published: false }).eq("id", id);
      break;
    case "feature":
      await supabase.from("songs").update({ featured_at: new Date().toISOString() }).eq("id", id);
      break;
    case "unfeature":
      await supabase.from("songs").update({ featured_at: null }).eq("id", id);
      break;
    case "delete":
      await supabase.from("songs").delete().eq("id", id);
      break;
  }
  // la publication est déjà tracée par la base (validation d'un titre)
  const labels: Record<string, string> = { unpublish: "titre_depublie", feature: "selection_ajout", unfeature: "selection_retrait", delete: "titre_supprime" };
  if (labels[str(fd, "do")]) await log(labels[str(fd, "do")], "song", id);
  revalidatePath("/admin/catalogue");
  revalidatePath("/artistes", "layout");
  revalidatePath("/");
}

// ===== Utilisateurs =====
export async function setUserRole(fd: FormData) {
  const { supabase, log } = await requireAdmin();
  const { error } = await supabase.rpc("admin_set_role", { p_user: str(fd, "id"), p_role: str(fd, "role") });
  if (!error) await log("role_change", "user", str(fd, "id"), str(fd, "role"));
  revalidatePath("/admin/utilisateurs");
}

export async function setUserSuspended(fd: FormData) {
  const { supabase, log } = await requireAdmin();
  const suspended = str(fd, "suspended") === "true";
  const { error } = await supabase.rpc("admin_set_suspended", { p_user: str(fd, "id"), p_suspended: suspended });
  if (!error) await log(suspended ? "compte_suspendu" : "compte_retabli", "user", str(fd, "id"));
  revalidatePath("/admin/utilisateurs");
  revalidatePath("/");
}

// ===== Mises en avant =====
const promoSchema = z.object({
  kind: z.enum(["banner", "song", "artist", "event"]),
  title: z.string().trim().min(2, "Titre trop court.").max(120),
  subtitle: z.string().trim().max(240),
  link_url: z.string().trim().max(500).refine((v) => v === "" || v.startsWith("/") || /^https?:\/\/\S+$/.test(v), "Lien : adresse complète (https://…) ou page du site (/…)."),
  placement: z.enum(["site", "app", "both"]),
  starts: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date de début invalide."),
  ends: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date de fin invalide."),
});

export async function savePromotion(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, log } = await requireAdmin();
  const parsed = promoSchema.safeParse({
    kind: str(fd, "kind"), title: str(fd, "title"), subtitle: str(fd, "subtitle"), link_url: str(fd, "link_url"),
    placement: str(fd, "placement"), starts: str(fd, "starts"), ends: str(fd, "ends"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const d = parsed.data;
  const startsAt = new Date(`${d.starts}T00:00:00Z`);
  const endsAt = new Date(`${d.ends}T23:59:59Z`);
  if (endsAt <= startsAt) return { error: "La fin doit être après le début." };
  const target = str(fd, "target");
  if (d.kind !== "banner" && !target) return { error: "Choisissez le titre, l'artiste ou l'événement à mettre en avant." };
  const image = await uploadImage(fd.get("image") as File | null, "articles");
  if (image && "error" in image) return { error: image.error };
  if (d.kind === "banner" && !image) return { error: "Une bannière a besoin d'une image." };

  const { error } = await supabase.from("promotions").insert({
    kind: d.kind, title: d.title, subtitle: d.subtitle, link_url: d.link_url, placement: d.placement,
    image_url: image?.url ?? "",
    song_id: d.kind === "song" ? target : null,
    artist_id: d.kind === "artist" ? target : null,
    event_id: d.kind === "event" ? target : null,
    submission_id: str(fd, "submission_id") || null,
    sponsored: fd.get("sponsored") === "on",
    starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(),
  });
  if (error) return { error: "Enregistrement impossible. Vérifiez que le fichier SQL « MGS - 8 » a été exécuté." };
  await log("mise_en_avant_creee", "promotion", "", `${d.title} (${d.starts} → ${d.ends})`);
  revalidatePath("/admin/mises-en-avant");
  revalidatePath("/");
  return { ok: true, message: "Mise en avant programmée." };
}

export async function promotionAction(fd: FormData) {
  const { supabase, log } = await requireAdmin();
  const id = str(fd, "id");
  if (str(fd, "do") === "delete") await supabase.from("promotions").delete().eq("id", id);
  else await supabase.from("promotions").update({ active: str(fd, "do") === "activate" }).eq("id", id);
  await log(`mise_en_avant_${str(fd, "do")}`, "promotion", id);
  revalidatePath("/admin/mises-en-avant");
  revalidatePath("/");
}

// ===== Signalements =====
export async function handleReport(fd: FormData) {
  const { supabase, userId, log } = await requireAdmin();
  const songId = str(fd, "song_id");
  const todo = str(fd, "do");
  if (todo === "unpublish" && songId) await supabase.from("songs").update({ is_published: false }).eq("id", songId);
  const status = todo === "dismiss" ? "dismissed" : "resolved";
  const resolution = todo === "unpublish" ? "Titre dépublié" : todo === "dismiss" ? "Signalement écarté" : "Traité";
  // tous les signalements ouverts sur ce titre sont clos en même temps
  await supabase
    .from("reports")
    .update({ status, resolution, handled_by: userId, handled_at: new Date().toISOString() })
    .eq("song_id", songId)
    .eq("status", "open");
  await log(todo === "unpublish" ? "signalement_titre_depublie" : todo === "dismiss" ? "signalement_ecarte" : "signalement_traite", "song", songId);
  revalidatePath("/admin/signalements");
  revalidatePath("/admin");
  revalidatePath("/");
}
