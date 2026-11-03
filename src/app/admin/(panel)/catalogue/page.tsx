import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatCount, formatDate, formatDuration } from "@/lib/format";
import { songAction } from "../../actions";
import SongEditor from "./SongEditor";

type Row = {
  id: string; title: string; genre: string; cover_url: string; audio_url: string; duration: number;
  streams_count: number; likes_count: number; is_published: boolean; review_status: "pending" | "approved" | "rejected";
  featured_at: string | null; created_at: string;
  artists: { slug: string; profiles: { full_name: string } | null } | null;
};

const FILTERS = {
  publie: "Publiés",
  attente: "En attente",
  refuse: "Refusés",
  selection: "Sélection MGS",
  indisponible: "Sans fichier audio",
} as const;
type Filter = keyof typeof FILTERS;

function status(s: Row) {
  if (s.is_published) return { label: "Publié", cls: "bg-emerald-100 text-emerald-900" };
  if (s.review_status === "pending") return { label: "En attente", cls: "bg-amber-100 text-amber-900" };
  if (s.review_status === "rejected") return { label: "Refusé", cls: "bg-red-100 text-red-800" };
  return { label: "Dépublié", cls: "bg-zinc-200 text-zinc-700" };
}

function Act({ id, todo, label, danger }: { id: string; todo: string; label: string; danger?: boolean }) {
  return (
    <form action={songAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="do" value={todo} />
      <button className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${danger ? "border-red-300 text-red-700 hover:bg-red-50" : "border-line hover:border-plum hover:text-plum"}`}>{label}</button>
    </form>
  );
}

export default async function CataloguePage({ searchParams }: { searchParams: Promise<{ filtre?: string; q?: string }> }) {
  const { supabase } = await requireAdmin();
  const { filtre, q } = await searchParams;
  const filter = filtre && filtre in FILTERS ? (filtre as Filter) : null;

  let query = supabase
    .from("songs")
    .select("id, title, genre, cover_url, audio_url, duration, streams_count, likes_count, is_published, review_status, featured_at, created_at, artists(slug, profiles(full_name))")
    .order("created_at", { ascending: false })
    .limit(300);
  if (filter === "publie") query = query.eq("is_published", true);
  if (filter === "attente") query = query.eq("review_status", "pending");
  if (filter === "refuse") query = query.eq("review_status", "rejected");
  if (filter === "selection") query = query.not("featured_at", "is", null);
  if (filter === "indisponible") query = query.or("audio_url.eq.,audio_url.ilike.%audiomack%");
  const { data } = await query;
  let songs = (data ?? []) as unknown as Row[];
  const term = (q ?? "").trim().toLowerCase();
  if (term) songs = songs.filter((s) => s.title.toLowerCase().includes(term) || s.artists?.profiles?.full_name.toLowerCase().includes(term));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Catalogue</h1>
        <p className="mt-1 text-mute">Tous les titres de l&apos;application. La Sélection MGS est mise en avant sur l&apos;accueil du site et de l&apos;app.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/admin/catalogue" className={`rounded-full px-4 py-2 text-sm ${!filter ? "bg-ink text-white" : "bg-white text-mute"}`}>Tous</Link>
        {(Object.keys(FILTERS) as Filter[]).map((f) => (
          <Link key={f} href={`/admin/catalogue?filtre=${f}`} className={`rounded-full px-4 py-2 text-sm ${filter === f ? "bg-ink text-white" : "bg-white text-mute"}`}>{FILTERS[f]}</Link>
        ))}
        <form className="ml-auto flex gap-2">
          {filter && <input type="hidden" name="filtre" value={filter} />}
          <input name="q" defaultValue={q} placeholder="Titre ou artiste" aria-label="Rechercher" className="field py-2" />
          <button className="btn-primary min-h-10">Chercher</button>
        </form>
      </div>

      {songs.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucun titre.</p>
      ) : (
        <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white">
          {songs.map((s) => {
            const st = status(s);
            const playable = /^https?:\/\//.test(s.audio_url) && !s.audio_url.includes("audiomack.com");
            return (
              <li key={s.id} className="px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.cover_url ? <img src={s.cover_url} alt="" className="size-14 rounded-lg object-cover" /> : <div className="size-14 rounded-lg bg-paper" />}
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      {s.title}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                      {s.featured_at && <span className="rounded-full bg-plum px-2.5 py-0.5 text-xs font-semibold text-white">Sélection MGS</span>}
                      {!playable && <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-mute">sans fichier audio</span>}
                    </p>
                    <p className="text-sm text-mute">
                      {s.artists?.profiles?.full_name ?? "Artiste"} · {s.genre}{s.duration ? ` · ${formatDuration(s.duration)}` : ""} · {formatCount(s.streams_count)} écoutes · {s.likes_count} j&apos;aime · ajouté le {formatDate(s.created_at, { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.is_published ? <Act id={s.id} todo="unpublish" label="Dépublier" /> : playable && <Act id={s.id} todo="publish" label="Publier" />}
                    {s.is_published && (s.featured_at ? <Act id={s.id} todo="unfeature" label="Retirer de la sélection" /> : <Act id={s.id} todo="feature" label="Sélection MGS" />)}
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-mute">Modifier, écouter, supprimer</summary>
                  {playable && <audio controls preload="none" src={s.audio_url} className="mt-3 w-full max-w-xl" />}
                  <SongEditor id={s.id} title={s.title} genre={s.genre} />
                  <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
                    <span className="text-sm text-mute">Suppression définitive (écoutes et j&apos;aime compris) :</span>
                    <Act id={s.id} todo="delete" label="Supprimer le titre" danger />
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
