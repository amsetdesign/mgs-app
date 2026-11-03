import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtistSongs, getSong } from "@/lib/data";
import { Visual, toSongRow } from "@/components/Cards";
import SongList from "@/components/SongList";
import { formatDuration } from "@/lib/format";
import { SITE } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const song = await getSong((await params).id);
  if (!song) return { title: "Titre introuvable" };
  const artist = song.artists?.profiles?.full_name ?? "Artiste";
  return {
    title: `${song.title}, ${artist}`,
    description: `Écoutez « ${song.title} » de ${artist} sur Music Gospel Sénégal.`,
    alternates: { canonical: `/titres/${song.id}` },
    openGraph: { type: "music.song", title: `${song.title} · ${artist}`, images: song.cover_url ? [song.cover_url] : undefined },
  };
}

// Page d'un titre : c'est elle qu'ouvrent les liens partagés depuis l'application
export default async function SongPage({ params }: Props) {
  const song = await getSong((await params).id);
  if (!song) notFound();
  const artist = song.artists?.profiles?.full_name ?? "Artiste";
  const more = (await getArtistSongs(song.artist_id)).filter((s) => s.id !== song.id).slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    genre: song.genre,
    url: `${SITE.url}/titres/${song.id}`,
    ...(song.duration ? { duration: `PT${Math.floor(song.duration / 60)}M${song.duration % 60}S` } : {}),
    ...(song.cover_url ? { image: song.cover_url } : {}),
    byArtist: { "@type": "MusicGroup", name: artist, ...(song.artists?.slug ? { url: `${SITE.url}/artistes/${song.artists.slug}` } : {}) },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="bg-ink text-white">
        <div className="container-x grid gap-10 py-14 md:grid-cols-[340px_1fr] md:items-end lg:py-20">
          <div className="overflow-hidden rounded-[24px]">
            <Visual src={song.cover_url} alt={`Pochette de ${song.title}`} label={song.title} className="aspect-square w-full" />
          </div>
          <div>
            <p className="eyebrow text-orchid">{song.genre}{song.duration ? ` · ${formatDuration(song.duration)}` : ""}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight sm:text-6xl">{song.title}</h1>
            {song.artists?.slug ? (
              <Link href={`/artistes/${song.artists.slug}`} className="mt-3 inline-block text-xl text-haze hover:text-white">{artist}</Link>
            ) : (
              <p className="mt-3 text-xl text-haze">{artist}</p>
            )}
            <div className="mt-8 max-w-xl rounded-[var(--radius-card)] bg-night p-2">
              <SongList songs={[toSongRow(song)]} dark />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`musicgospelsn://song/${song.id}`} className="btn-primary">Ouvrir dans l&apos;application</a>
              {SITE.playStore && <a href={SITE.playStore} className="btn-ghost text-white">Google Play</a>}
              {SITE.appStore && <a href={SITE.appStore} className="btn-ghost text-white">App Store</a>}
            </div>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-14 py-14 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="paroles">
          <h2 id="paroles" className="font-display text-2xl font-bold">Paroles</h2>
          {song.lyrics ? (
            <p className="mt-4 text-[17px] leading-relaxed whitespace-pre-line text-ink/85">{song.lyrics}</p>
          ) : (
            <p className="mt-3 text-mute">Les paroles de ce titre ne sont pas encore disponibles.</p>
          )}
        </section>
        {more.length > 0 && (
          <aside aria-labelledby="plus">
            <h2 id="plus" className="font-display text-2xl font-bold">Du même artiste</h2>
            <div className="mt-4"><SongList songs={more.map(toSongRow)} /></div>
          </aside>
        )}
      </div>
    </>
  );
}
