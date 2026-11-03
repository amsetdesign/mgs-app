import { requireAdmin } from "@/lib/admin";
import { formatDate, formatPrice, nowMs, todayIso } from "@/lib/format";
import { PACKS } from "@/lib/site";
import { promotionAction } from "../../actions";
import PromotionForm from "./PromotionForm";

type Promo = {
  id: string; kind: "banner" | "song" | "artist" | "event"; title: string; subtitle: string; image_url: string;
  placement: "site" | "app" | "both"; sponsored: boolean; starts_at: string; ends_at: string; active: boolean;
  songs: { title: string } | null; artists: { profiles: { full_name: string } | null } | null; events: { title: string } | null;
  submissions: { title: string; artist_name: string; pack: string } | null;
};

const KIND = { banner: "Bannière", song: "Titre", artist: "Artiste", event: "Événement" } as const;
const WHERE = { site: "Site", app: "Application", both: "Site et application" } as const;

function stateOf(p: Promo, now: number) {
  if (!p.active) return { label: "En pause", cls: "bg-zinc-200 text-zinc-700" };
  if (new Date(p.ends_at).getTime() < now) return { label: "Terminée", cls: "bg-zinc-100 text-mute" };
  if (new Date(p.starts_at).getTime() > now) return { label: "Programmée", cls: "bg-sky-100 text-sky-900" };
  return { label: "En ligne", cls: "bg-emerald-100 text-emerald-900" };
}

export default async function PromotionsPage() {
  const { supabase } = await requireAdmin();
  const [{ data: promos, error }, { data: songs }, { data: artists }, { data: events }, { data: subs }] = await Promise.all([
    supabase.from("promotions").select("*, songs(title), artists(profiles(full_name)), events(title), submissions(title, artist_name, pack)").order("starts_at", { ascending: false }).limit(200),
    supabase.from("songs").select("id, title, artists(profiles(full_name))").eq("is_published", true).order("created_at", { ascending: false }).limit(300),
    supabase.from("artists").select("id, profiles(full_name)").limit(500),
    supabase.from("events").select("id, title, starts_at").eq("status", "approved").order("starts_at", { ascending: false }).limit(200),
    supabase.from("submissions").select("id, title, artist_name, pack, amount").in("status", ["paye", "en_cours"]).order("created_at", { ascending: false }).limit(200),
  ]);
  const list = (promos ?? []) as unknown as Promo[];
  const now = nowMs();
  const today = todayIso();
  type Named = { id: string; title?: string; profiles?: { full_name: string } | null; artists?: { profiles: { full_name: string } | null } | null };
  const songOpts = ((songs ?? []) as unknown as Named[]).map((s) => ({ id: s.id, label: `${s.title} · ${s.artists?.profiles?.full_name ?? ""}` }));
  const artistOpts = ((artists ?? []) as unknown as Named[]).map((a) => ({ id: a.id, label: a.profiles?.full_name || "Sans nom" })).sort((a, b) => a.label.localeCompare(b.label, "fr"));
  const eventOpts = ((events ?? []) as { id: string; title: string; starts_at: string }[]).map((e) => ({ id: e.id, label: `${e.title} · ${formatDate(e.starts_at, { day: "numeric", month: "short", year: "numeric" })}` }));
  const subOpts = ((subs ?? []) as { id: string; title: string; artist_name: string; pack: string; amount: number }[]).map((s) => ({
    id: s.id,
    label: `${s.artist_name} · ${s.title} (${PACKS.find((p) => p.id === s.pack)?.name ?? s.pack}, ${formatPrice(s.amount)})`,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Mises en avant</h1>
        <p className="mt-1 text-mute">Programmez ce qui s&apos;affiche en tête de l&apos;accueil : packs payés, partenaires, événements à soutenir. Chaque mise en avant s&apos;arrête seule à sa date de fin.</p>
      </div>
      {error ? (
        <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Indisponible. Vérifiez que le fichier SQL « MGS - 8 » a été exécuté.</p>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">Nouvelle mise en avant</h2>
            <PromotionForm songs={songOpts} artists={artistOpts} events={eventOpts} submissions={subOpts} today={today} />
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">Programmation</h2>
            {list.length === 0 ? (
              <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Aucune mise en avant pour l&apos;instant.</p>
            ) : (
              <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white">
                {list.map((p) => {
                  const st = stateOf(p, now);
                  const target = p.songs?.title ?? p.artists?.profiles?.full_name ?? p.events?.title ?? "";
                  return (
                    <li key={p.id} className="flex flex-wrap items-center gap-4 px-4 py-4 sm:px-5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.image_url ? <img src={p.image_url} alt="" className="h-14 w-24 rounded-lg object-cover" /> : <div className="h-14 w-24 rounded-lg bg-paper" />}
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 font-medium">
                          {p.title}
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                          {p.sponsored && <span className="rounded-full bg-paper px-2.5 py-0.5 text-xs">Sponsorisé</span>}
                        </p>
                        <p className="text-sm text-mute">
                          {KIND[p.kind]}{target ? ` : ${target}` : ""} · {WHERE[p.placement]} · du {formatDate(p.starts_at, { day: "numeric", month: "short" })} au {formatDate(p.ends_at, { day: "numeric", month: "short", year: "numeric" })}
                          {p.submissions ? ` · pack de ${p.submissions.artist_name}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <form action={promotionAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="do" value={p.active ? "pause" : "activate"} />
                          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-plum hover:text-plum">{p.active ? "Mettre en pause" : "Réactiver"}</button>
                        </form>
                        <form action={promotionAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="do" value="delete" />
                          <button className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">Supprimer</button>
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
