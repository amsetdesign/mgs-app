import Link from "next/link";
import { getArticles, getFeaturedArtists, getLatestSongs, getTopWeek, getUpcomingEvents } from "@/lib/data";
import { ArticleCard, ArtistCard, EmptyState, EventCard, SectionHead, toSongRow } from "@/components/Cards";
import SongList from "@/components/SongList";
import { IconArrow, IconCheck } from "@/components/icons";
import { PACKS, SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import { GGU, GGU3 } from "@/lib/photos";

export const revalidate = 300;

export default async function HomePage() {
  const [top, latest, artists, events, articles] = await Promise.all([
    getTopWeek(5),
    getLatestSongs(6),
    getFeaturedArtists(8),
    getUpcomingEvents({ limit: 4 }),
    getArticles({ limit: 4 }),
  ]);
  const chart = top.length >= 3 ? top : latest.slice(0, 5);
  const chartIsTop = top.length >= 3;

  return (
    <>
      {/* ===== Ouverture ===== */}
      <section className="relative overflow-hidden bg-ink text-white">
        <Image src={GGU3.heroStage.src} alt="" fill priority sizes="100vw" className="object-cover object-[70%_30%] opacity-60" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="container-x relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow text-orchid">Le média du gospel au Sénégal</p>
            <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.98] font-bold tracking-tight">
              Faire entendre le gospel sénégalais.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-haze">
              Les artistes, les sorties et les événements gospel du Sénégal et de la francophonie, réunis au même endroit. Écoutez, découvrez, et faites connaître votre projet.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/soumettre" className="btn-primary">Soumettre un projet <IconArrow className="size-4" /></Link>
              <Link href="/evenements" className="btn-ghost text-white">Voir le calendrier gospel</Link>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-night/80 p-3 sm:p-5">
            <div className="flex items-baseline justify-between px-2 pb-3">
              <h2 className="font-display text-xl font-bold">{chartIsTop ? "Top 5 de la semaine" : "Dernières sorties"}</h2>
              <span className="text-xs text-haze">{chartIsTop ? "Écoutes réelles sur l'app MGS" : "À écouter maintenant"}</span>
            </div>
            {chart.length > 0 ? (
              <SongList songs={chart.map(toSongRow)} ranked={chartIsTop} dark />
            ) : (
              <p className="px-2 py-10 text-center text-haze">Les premiers titres arrivent très bientôt.</p>
            )}
          </div>
        </div>
      </section>

      {/* ===== Artistes ===== */}
      <section className="container-x py-20">
        <SectionHead eyebrow="Artistes à la une" title="Ceux qui portent le gospel" link={{ href: "/artistes", label: "Tous les artistes" }} />
        {artists.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {artists.map((a) => <ArtistCard key={a.id} artist={a} />)}
          </div>
        ) : (
          <EmptyState title="Les fiches artistes arrivent" text="Vous êtes artiste gospel ? Envoyez-nous votre projet pour apparaître ici." action={{ href: "/soumettre", label: "Soumettre un projet" }} />
        )}
      </section>

      {/* ===== Festival GGU ===== */}
      <section className="bg-ink pt-20 text-white">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-orchid">Organisé par MGS</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Galsen Gospel Urbain</h2>
              <p className="mt-5 max-w-xl text-lg text-haze">
                Le festival du gospel urbain à Dakar. La 3e édition, en décembre dernier, a réuni artistes et public autour du GGU Chill et du grand concert.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/galsen-gospel-urbain" className="btn-light">Découvrir le festival</Link>
                <a href={GGU.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white">Instagram du GGU</a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[GGU3.sceneVerte, GGU3.denim, GGU3.casquette].map((ph, i) => (
                <div key={ph.src} className={`relative overflow-hidden rounded-[var(--radius-card)] ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"}`}>
                  <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Calendrier ===== */}
      <section className="bg-ink py-20 text-white">
        <div className="container-x">
          <SectionHead dark eyebrow="Calendrier gospel" title="Prochains événements" link={{ href: "/evenements", label: "Tout le calendrier" }} />
          {events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((e) => <EventCard key={e.id} event={e} dark />)}
            </div>
          ) : (
            <EmptyState dark title="Aucun événement annoncé pour l'instant" text="Organisateurs : annoncez votre concert, veillée ou festival. Le calendrier aide toute la communauté à éviter les dates en double." action={{ href: "/evenements/soumettre", label: "Annoncer un événement" }} />
          )}
          {events.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-white/10 p-6">
              <p className="max-w-xl text-haze">Vous organisez un événement ? Vérifiez la date dans le calendrier et annoncez-le : nous évitons ensemble les chevauchements.</p>
              <Link href="/evenements/soumettre" className="btn-light">Annoncer un événement</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== Actualités ===== */}
      <section className="container-x py-20">
        <SectionHead eyebrow="Actualités" title="Le gospel, ici et maintenant" link={{ href: "/actualites", label: "Toutes les actualités" }} />
        {articles.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <ArticleCard article={articles[0]} large />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              {articles.slice(1, 4).map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        ) : (
          <EmptyState title="Les premiers articles arrivent" text="Interviews, sorties, témoignages : l'actualité du gospel sénégalais sera publiée ici." />
        )}
      </section>

      {/* ===== Packs ===== */}
      <section className="border-y border-line bg-white py-20">
        <div className="container-x">
          <SectionHead eyebrow="Promotion" title="Faites connaître votre projet" link={{ href: "/services", label: "Détail des packs" }} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PACKS.map((p) => (
              <div key={p.id} className={`flex flex-col rounded-[var(--radius-card)] border p-6 ${p.id === "premium" ? "border-plum bg-plum text-white" : "border-line bg-paper"}`}>
                <p className="font-display text-xl font-bold">{p.name}</p>
                <p className={`mt-1 text-sm ${p.id === "premium" ? "text-white/80" : "text-mute"}`}>{p.summary}</p>
                <p className="mt-5 font-display text-3xl font-bold">{formatPrice(p.price)}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex gap-2"><IconCheck className="mt-0.5 size-4 shrink-0" />{f}</li>
                  ))}
                </ul>
                <Link href={`/soumettre?pack=${p.id}`} className={`mt-6 ${p.id === "premium" ? "btn-light" : "btn-primary"}`}>Choisir</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Application ===== */}
      <section className="container-x py-20">
        <div className="grid gap-8 rounded-[28px] bg-plum p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow text-white/75">Application mobile</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Tout le gospel dans votre poche</h2>
            <p className="mt-4 max-w-xl text-white/85">
              Écoutez gratuitement, suivez vos artistes, créez vos playlists. Les artistes publient leurs titres et suivent leurs écoutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {SITE.playStore || SITE.appStore ? (
              <>
                {SITE.playStore && <a href={SITE.playStore} className="btn-light">Google Play</a>}
                {SITE.appStore && <a href={SITE.appStore} className="btn-light">App Store</a>}
              </>
            ) : (
              <p className="rounded-full border border-white/30 px-5 py-3 text-sm">Bientôt sur Android et iPhone</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
