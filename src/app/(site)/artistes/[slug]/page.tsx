import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtist, getArtistSongs, getArticles, getUpcomingEvents } from "@/lib/data";
import { ArticleCard, EventCard, Visual, toSongRow } from "@/components/Cards";
import SongList from "@/components/SongList";
import SocialLinks from "@/components/SocialLinks";
import { IconBadge } from "@/components/icons";
import { formatCount } from "@/lib/format";
import { SITE } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await getArtist((await params).slug);
  if (!artist) return { title: "Artiste introuvable" };
  const name = artist.profiles?.full_name || "Artiste";
  const bio = (artist.bio || artist.profiles?.bio || "").slice(0, 155);
  return {
    title: `${name}, artiste gospel`,
    description: bio || `Écoutez ${name} sur Music Gospel Sénégal : titres, biographie et prochains concerts.`,
    alternates: { canonical: `/artistes/${artist.slug}` },
    openGraph: { title: name, images: artist.profiles?.avatar_url ? [artist.profiles.avatar_url] : undefined, type: "profile" },
  };
}

export default async function ArtistPage({ params }: Props) {
  const artist = await getArtist((await params).slug);
  if (!artist) notFound();
  const [songs, events, articles] = await Promise.all([
    getArtistSongs(artist.id),
    getUpcomingEvents({ artistId: artist.id, limit: 6 }),
    getArticles({ artistId: artist.id, limit: 6 }),
  ]);

  const name = artist.profiles?.full_name || "Artiste";
  const bio = artist.bio || artist.profiles?.bio || "";
  const socials = { facebook: artist.social_facebook, instagram: artist.social_instagram, tiktok: artist.social_tiktok, youtube: artist.social_youtube };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name,
    genre: "Gospel",
    url: `${SITE.url}/artistes/${artist.slug}`,
    ...(artist.profiles?.avatar_url ? { image: artist.profiles.avatar_url } : {}),
    ...(bio ? { description: bio } : {}),
    sameAs: Object.values(socials).filter(Boolean),
    track: songs.slice(0, 10).map((s) => ({ "@type": "MusicRecording", name: s.title })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="bg-ink text-white">
        <div className="container-x grid gap-10 py-14 md:grid-cols-[320px_1fr] md:items-end lg:py-20">
          <div className="overflow-hidden rounded-[28px]">
            <Visual src={artist.profiles?.avatar_url ?? ""} alt={name} label={name} className="aspect-square w-full" />
          </div>
          <div>
            <p className="eyebrow text-orchid">{artist.profiles?.country || "Artiste gospel"}</p>
            <h1 className="mt-3 flex flex-wrap items-center gap-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              {name}
              {artist.verified && <IconBadge className="size-8 text-orchid" />}
            </h1>
            <dl className="mt-6 flex gap-8">
              <div><dt className="text-sm text-haze">Abonnés</dt><dd className="font-display text-2xl font-bold">{formatCount(artist.followers_count)}</dd></div>
              <div><dt className="text-sm text-haze">Écoutes</dt><dd className="font-display text-2xl font-bold">{formatCount(artist.streams_count)}</dd></div>
              <div><dt className="text-sm text-haze">Titres</dt><dd className="font-display text-2xl font-bold">{songs.length}</dd></div>
            </dl>
            <SocialLinks links={socials} className="mt-7 text-white" />
          </div>
        </div>
      </section>

      <div className="container-x grid gap-14 py-14 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-14">
          <section aria-labelledby="titres">
            <h2 id="titres" className="font-display text-2xl font-bold">Titres</h2>
            {songs.length > 0 ? (
              <div className="mt-4"><SongList songs={songs.map(toSongRow)} /></div>
            ) : (
              <p className="mt-3 text-mute">Les titres de {name} arrivent bientôt sur MGS.</p>
            )}
          </section>

          {articles.length > 0 && (
            <section aria-labelledby="articles">
              <h2 id="articles" className="font-display text-2xl font-bold">Dans les actualités</h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-12">
          <section aria-labelledby="bio">
            <h2 id="bio" className="font-display text-2xl font-bold">Biographie</h2>
            {bio ? (
              <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
                {bio.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            ) : (
              <p className="mt-3 text-mute">La biographie de {name} sera bientôt publiée.</p>
            )}
          </section>
          <section aria-labelledby="concerts">
            <h2 id="concerts" className="font-display text-2xl font-bold">Prochains concerts</h2>
            {events.length > 0 ? (
              <div className="mt-4 space-y-3">{events.map((e) => <EventCard key={e.id} event={e} />)}</div>
            ) : (
              <p className="mt-3 text-mute">Aucun concert annoncé pour le moment.</p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
