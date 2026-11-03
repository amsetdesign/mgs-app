import { requireAdmin } from "@/lib/admin";
import { formatDate, formatDuration } from "@/lib/format";
import { reviewSong } from "../../actions";

type PendingSong = {
  id: string; title: string; audio_url: string; cover_url: string; genre: string; duration: number; lyrics: string; created_at: string;
  artists: { profiles: { full_name: string } | null } | null;
};

export default async function SongsReviewPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("songs")
    .select("id, title, audio_url, cover_url, genre, duration, lyrics, created_at, artists(profiles(full_name))")
    .eq("review_status", "pending")
    .order("created_at");
  const songs = (data ?? []) as unknown as PendingSong[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Titres à valider</h1>
        <p className="mt-1 text-mute">Les titres envoyés depuis l&apos;application. Écoutez, puis publiez ou refusez : l&apos;artiste reçoit une notification.</p>
      </div>
      {songs.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucun titre en attente.</p>
      ) : (
        <ul className="space-y-4">
          {songs.map((s) => (
            <li key={s.id} className="rounded-[var(--radius-card)] bg-white p-5">
              <div className="flex flex-wrap items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {s.cover_url ? <img src={s.cover_url} alt="" className="size-20 rounded-xl object-cover" /> : <div className="size-20 rounded-xl bg-paper" />}
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-bold">{s.title}</p>
                  <p className="text-mute">{s.artists?.profiles?.full_name ?? "Artiste"} · {s.genre}{s.duration ? ` · ${formatDuration(s.duration)}` : ""}</p>
                  <p className="text-xs text-mute">Reçu le {formatDate(s.created_at)}</p>
                </div>
              </div>
              <audio controls preload="none" src={s.audio_url} className="mt-4 w-full" />
              {s.lyrics && (
                <details className="mt-2 text-sm"><summary className="cursor-pointer text-mute">Paroles</summary><p className="mt-2 whitespace-pre-line">{s.lyrics}</p></details>
              )}
              <form action={reviewSong} className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
                <input type="hidden" name="id" value={s.id} />
                <label className="min-w-56 flex-1">
                  <span className="label">Motif en cas de refus (envoyé à l&apos;artiste)</span>
                  <input name="note" maxLength={500} className="field py-2.5" placeholder="Ex. : son saturé, pochette floue, droits à confirmer" />
                </label>
                <button name="decision" value="reject" className="btn min-h-10 border border-red-300 text-red-700 hover:bg-red-50">Refuser</button>
                <button name="decision" value="approve" className="btn-primary min-h-10">Publier</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
