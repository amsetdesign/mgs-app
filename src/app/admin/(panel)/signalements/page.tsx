import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { handleReport } from "../../actions";

const REASONS: Record<string, string> = {
  droits: "Droits d'auteur (titre volé ou sans autorisation)",
  contenu: "Contenu inapproprié",
  qualite: "Mauvaise qualité (son, pochette)",
  autre: "Autre",
};

type Report = {
  id: string; reason: string; details: string; status: "open" | "resolved" | "dismissed"; resolution: string; created_at: string; handled_at: string | null;
  song_id: string;
  songs: { id: string; title: string; cover_url: string; audio_url: string; is_published: boolean; artists: { slug: string; profiles: { full_name: string } | null } | null } | null;
  profiles: { full_name: string } | null;
};

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ vue?: string }> }) {
  const { supabase } = await requireAdmin();
  const { vue } = await searchParams;
  const history = vue === "historique";
  const { data, error } = await supabase
    .from("reports")
    .select("id, reason, details, status, resolution, created_at, handled_at, song_id, songs(id, title, cover_url, audio_url, is_published, artists(slug, profiles(full_name))), profiles!reports_reporter_id_fkey(full_name)")
    .in("status", history ? ["resolved", "dismissed"] : ["open"])
    .order("created_at", { ascending: false })
    .limit(200);
  const reports = (data ?? []) as unknown as Report[];

  // un titre signalé plusieurs fois n'apparaît qu'une fois, avec tous ses motifs
  const bySong = new Map<string, Report[]>();
  for (const r of reports) bySong.set(r.song_id, [...(bySong.get(r.song_id) ?? []), r]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Signalements</h1>
        <p className="mt-1 text-mute">Les titres signalés par les auditeurs dans l&apos;application. Écoutez, puis dépubliez ou écartez le signalement.</p>
      </div>
      <nav className="flex gap-2">
        <Link href="/admin/signalements" className={`rounded-full px-4 py-2 text-sm ${!history ? "bg-ink text-white" : "bg-white text-mute"}`}>À traiter</Link>
        <Link href="/admin/signalements?vue=historique" className={`rounded-full px-4 py-2 text-sm ${history ? "bg-ink text-white" : "bg-white text-mute"}`}>Historique</Link>
      </nav>
      {error ? (
        <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Indisponible. Vérifiez que le fichier SQL « MGS - 9 » a été exécuté.</p>
      ) : bySong.size === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">{history ? "Aucun signalement traité pour l'instant." : "Aucun signalement en attente."}</p>
      ) : (
        <ul className="space-y-4">
          {[...bySong.entries()].map(([songId, list]) => {
            const song = list[0].songs;
            return (
              <li key={songId} className="rounded-[var(--radius-card)] bg-white p-5">
                <div className="flex flex-wrap items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {song?.cover_url ? <img src={song.cover_url} alt="" className="size-16 rounded-lg object-cover" /> : <div className="size-16 rounded-lg bg-paper" />}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-bold">{song?.title ?? "Titre supprimé"}</p>
                    <p className="text-sm text-mute">
                      {song?.artists?.profiles?.full_name ?? "Artiste"} · {song?.is_published ? "en ligne" : "dépublié"} · signalé {list.length} fois
                    </p>
                  </div>
                  {list.length > 1 && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">{list.length} signalements</span>}
                </div>
                {song?.audio_url && /^https?:\/\//.test(song.audio_url) && <audio controls preload="none" src={song.audio_url} className="mt-4 w-full max-w-xl" />}
                <ul className="mt-4 space-y-2">
                  {list.map((r) => (
                    <li key={r.id} className="rounded-xl bg-paper px-4 py-3 text-sm">
                      <p className="font-semibold">{REASONS[r.reason] ?? r.reason}</p>
                      {r.details && <p className="mt-1 whitespace-pre-line">{r.details}</p>}
                      <p className="mt-1 text-xs text-mute">
                        Par {r.profiles?.full_name || "un auditeur"} le {formatDate(r.created_at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        {history && r.resolution ? ` · ${r.resolution}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
                {!history && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                    {song?.is_published && (
                      <form action={handleReport}>
                        <input type="hidden" name="id" value={list[0].id} />
                        <input type="hidden" name="song_id" value={songId} />
                        <input type="hidden" name="do" value="unpublish" />
                        <button className="btn min-h-10 border border-red-300 text-red-700 hover:bg-red-50">Dépublier le titre</button>
                      </form>
                    )}
                    <form action={handleReport}>
                      <input type="hidden" name="id" value={list[0].id} />
                      <input type="hidden" name="song_id" value={songId} />
                      <input type="hidden" name="do" value="dismiss" />
                      <button className="btn min-h-10 border border-line hover:border-plum">Écarter (pas de problème)</button>
                    </form>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
