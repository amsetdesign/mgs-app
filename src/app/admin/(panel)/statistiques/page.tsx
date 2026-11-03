import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatCount, formatDate } from "@/lib/format";

type TopSong = { id: string; title: string; cover_url: string; artist: string; plays: number; listeners: number };
type TopArtist = { id: string; slug: string; name: string; avatar_url: string; plays: number; listeners: number };
type Top = { songs: TopSong[]; artists: TopArtist[]; new_users: number; new_artists: number; new_songs: number };
type ArtistStats = {
  followers: number; streams_total: number; streams_period: number; listeners_period: number; likes: number;
  by_day: { day: string; plays: number }[];
  songs: { id: string; title: string; cover_url: string; is_published: boolean; total: number; likes: number; plays: number; completed: number }[];
};

const PERIODS = [7, 30, 90, 365] as const;

/** Écoutes par jour : une seule teinte, valeur au survol, tableau lisible en dessous. */
function Bars({ data, label }: { data: { day: string; plays: number }[]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.plays));
  const W = 720, H = 160, gap = data.length > 60 ? 1 : 2;
  const bw = (W - gap * (data.length - 1)) / data.length;
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" role="img" aria-label={label}>
        <line x1="0" x2={W} y1={H} y2={H} stroke="#e8e1ec" />
        {data.map((d, i) => {
          const h = (d.plays / max) * (H - 6);
          const x = i * (bw + gap);
          return (
            <g key={d.day}>
              <rect x={x} y={0} width={bw} height={H} fill="transparent"><title>{`${formatDate(d.day, { day: "numeric", month: "long" })} : ${d.plays} écoute${d.plays > 1 ? "s" : ""}`}</title></rect>
              {d.plays > 0 && <rect x={x} y={H - h} width={bw} height={h} rx={Math.min(3, bw / 2)} fill="#800080" pointerEvents="none" />}
            </g>
          );
        })}
        <text x="0" y={H + 15} fontSize="11" fill="#6d6474">{formatDate(data[0]?.day, { day: "numeric", month: "short" })}</text>
        <text x={W} y={H + 15} fontSize="11" fill="#6d6474" textAnchor="end">Aujourd&apos;hui</text>
      </svg>
    </figure>
  );
}

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ jours?: string; artiste?: string }> }) {
  const { supabase } = await requireAdmin();
  const { jours, artiste } = await searchParams;
  const days = PERIODS.find((p) => String(p) === jours) ?? 30;
  const [{ data: topData, error }, { data: artistList }] = await Promise.all([
    supabase.rpc("admin_top", { p_days: days }),
    supabase.from("artists").select("id, profiles(full_name)").limit(500),
  ]);
  const top = topData as Top | null;
  const artists = ((artistList ?? []) as unknown as { id: string; profiles: { full_name: string } | null }[])
    .map((a) => ({ id: a.id, name: a.profiles?.full_name || "Sans nom" }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const selected = artists.find((a) => a.id === artiste);
  const { data: statsData } = selected ? await supabase.rpc("admin_artist_stats", { p_artist: selected.id, p_days: days }) : { data: null };
  const stats = statsData as ArtistStats | null;
  const q = (extra: Record<string, string>) => `/admin/statistiques?${new URLSearchParams({ jours: String(days), ...(selected ? { artiste: selected.id } : {}), ...extra })}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Statistiques</h1>
        <p className="mt-1 text-mute">Écoutes de 30 secondes ou plus dans l&apos;application, une par personne et par titre toutes les 30 minutes.</p>
      </div>
      <nav aria-label="Période" className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <Link key={p} href={q({ jours: String(p) })} className={`rounded-full px-4 py-2 text-sm ${p === days ? "bg-ink text-white" : "bg-white text-mute"}`}>
            {p === 365 ? "1 an" : `${p} jours`}
          </Link>
        ))}
      </nav>

      {error || !top ? (
        <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Indisponible. Vérifiez que le fichier SQL « MGS - 9 » a été exécuté.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[["Nouveaux comptes", top.new_users], ["Nouveaux artistes", top.new_artists], ["Titres publiés", top.new_songs]].map(([l, v]) => (
              <div key={l as string} className="rounded-[var(--radius-card)] bg-white p-5">
                <p className="text-sm text-mute">{l}</p>
                <p className="mt-1 font-display text-3xl font-bold tabular-nums">{formatCount(v as number)}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[var(--radius-card)] bg-white p-5">
              <h2 className="font-display text-lg font-bold">Titres les plus écoutés</h2>
              {top.songs.length === 0 ? <p className="mt-3 text-mute">Pas encore d&apos;écoutes sur la période.</p> : (
                <table className="mt-3 w-full text-left text-sm">
                  <thead className="text-mute"><tr><th className="py-1.5 font-medium">#</th><th className="py-1.5 font-medium">Titre</th><th className="py-1.5 text-right font-medium">Écoutes</th><th className="py-1.5 text-right font-medium">Auditeurs</th></tr></thead>
                  <tbody>
                    {top.songs.map((s, i) => (
                      <tr key={s.id} className="border-t border-line">
                        <td className="py-2 text-mute tabular-nums">{i + 1}</td>
                        <td className="py-2"><span className="font-medium">{s.title}</span><span className="block text-xs text-mute">{s.artist}</span></td>
                        <td className="py-2 text-right tabular-nums">{formatCount(s.plays)}</td>
                        <td className="py-2 text-right tabular-nums">{formatCount(s.listeners)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
            <section className="rounded-[var(--radius-card)] bg-white p-5">
              <h2 className="font-display text-lg font-bold">Artistes les plus écoutés</h2>
              {top.artists.length === 0 ? <p className="mt-3 text-mute">Pas encore d&apos;écoutes sur la période.</p> : (
                <table className="mt-3 w-full text-left text-sm">
                  <thead className="text-mute"><tr><th className="py-1.5 font-medium">#</th><th className="py-1.5 font-medium">Artiste</th><th className="py-1.5 text-right font-medium">Écoutes</th><th className="py-1.5 text-right font-medium">Auditeurs</th></tr></thead>
                  <tbody>
                    {top.artists.map((a, i) => (
                      <tr key={a.id} className="border-t border-line">
                        <td className="py-2 text-mute tabular-nums">{i + 1}</td>
                        <td className="py-2"><Link href={q({ artiste: a.id })} className="font-medium hover:underline">{a.name}</Link></td>
                        <td className="py-2 text-right tabular-nums">{formatCount(a.plays)}</td>
                        <td className="py-2 text-right tabular-nums">{formatCount(a.listeners)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>

          <section className="space-y-4 rounded-[var(--radius-card)] bg-white p-5">
            <form className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="jours" value={days} />
              <label className="min-w-64">
                <span className="label">Détail d&apos;un artiste</span>
                <select name="artiste" defaultValue={selected?.id ?? ""} className="field py-2.5">
                  <option value="" disabled>Choisir un artiste</option>
                  {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </label>
              <button className="btn-primary min-h-10">Afficher</button>
            </form>
            {selected && stats && (
              <>
                <h2 className="font-display text-xl font-bold">{selected.name}</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[["Écoutes (période)", stats.streams_period], ["Auditeurs (période)", stats.listeners_period], ["Écoutes au total", stats.streams_total], ["Abonnés", stats.followers], ["J'aime", stats.likes]].map(([l, v]) => (
                    <div key={l as string} className="rounded-xl bg-paper p-4">
                      <p className="text-xs text-mute">{l}</p>
                      <p className="mt-1 font-display text-2xl font-bold tabular-nums">{formatCount(Number(v ?? 0))}</p>
                    </div>
                  ))}
                </div>
                <Bars data={stats.by_day} label={`Écoutes par jour de ${selected.name}`} />
                <table className="w-full text-left text-sm">
                  <thead className="text-mute"><tr><th className="py-1.5 font-medium">Titre</th><th className="py-1.5 text-right font-medium">Écoutes (période)</th><th className="py-1.5 text-right font-medium">Écoutées en entier</th><th className="py-1.5 text-right font-medium">Total</th><th className="py-1.5 text-right font-medium">J&apos;aime</th></tr></thead>
                  <tbody>
                    {stats.songs.map((s) => (
                      <tr key={s.id} className="border-t border-line">
                        <td className="py-2">{s.title}{!s.is_published && <span className="ml-2 text-xs text-mute">(non publié)</span>}</td>
                        <td className="py-2 text-right tabular-nums">{formatCount(s.plays)}</td>
                        <td className="py-2 text-right tabular-nums">{s.plays ? `${Math.round((s.completed / s.plays) * 100)} %` : "–"}</td>
                        <td className="py-2 text-right tabular-nums">{formatCount(s.total)}</td>
                        <td className="py-2 text-right tabular-nums">{s.likes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
