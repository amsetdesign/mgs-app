"use client";

import Link from "next/link";
import { toggleTrack, usePlayback } from "@/lib/audio";
import { IconHeadphones, IconPause, IconPlay } from "./icons";

export type SongRow = {
  id: string;
  title: string;
  audio_url: string;
  cover_url: string;
  duration: number;
  artistName: string;
  artistSlug?: string;
  plays?: number;
};

function fmt(sec: number) {
  if (!sec || !Number.isFinite(sec)) return "";
  return `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
}

/** Liste de titres écoutables dans le navigateur : un seul titre joue à la fois. */
export default function SongList({ songs, ranked = false, dark = false }: { songs: SongRow[]; ranked?: boolean; dark?: boolean }) {
  const { id: current, playing, progress } = usePlayback();
  const toggle = (song: SongRow) => toggleTrack(song.id, song.audio_url);

  const text = dark ? "text-white" : "text-ink";
  const sub = dark ? "text-haze" : "text-mute";
  const row = dark ? "hover:bg-white/5" : "hover:bg-white";

  return (
    <ol className="flex flex-col">
      {songs.map((song, i) => {
        const active = current === song.id;
        return (
          <li key={song.id} className={`group relative flex items-center gap-4 rounded-2xl px-2 py-2.5 transition-colors sm:px-3 ${row}`}>
            {ranked && <span className={`w-6 shrink-0 text-center font-display text-xl font-bold ${active ? "text-orchid" : sub}`}>{i + 1}</span>}
            <button
              type="button"
              onClick={() => toggle(song)}
              aria-label={active && playing ? `Mettre en pause ${song.title}` : `Écouter ${song.title}`}
              className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-night-2"
            >
              {song.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={song.cover_url} alt="" className="size-full object-cover" loading="lazy" />
              ) : (
                <IconHeadphones className="size-6 text-haze" />
              )}
              <span className={`absolute inset-0 flex items-center justify-center bg-ink/55 text-white transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`}>
                {active && playing ? <IconPause className="size-5" /> : <IconPlay className="size-5" />}
              </span>
            </button>
            <div className="min-w-0 flex-1">
              <Link href={`/titres/${song.id}`} className={`block truncate font-medium hover:underline ${active ? (dark ? "text-orchid" : "text-plum") : text}`}>{song.title}</Link>
              {song.artistSlug ? (
                <Link href={`/artistes/${song.artistSlug}`} className={`block truncate text-sm ${sub} hover:underline`}>{song.artistName}</Link>
              ) : (
                <p className={`truncate text-sm ${sub}`}>{song.artistName}</p>
              )}
              {active && (
                <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-current/10" aria-hidden>
                  <div className="h-full bg-plum" style={{ width: `${progress * 100}%` }} />
                </div>
              )}
            </div>
            <span className={`shrink-0 text-sm tabular-nums ${sub}`}>
              {song.plays != null ? `${song.plays} écoute${song.plays > 1 ? "s" : ""}` : fmt(song.duration)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
