import Link from "next/link";
import { getArticles, getFeaturedArtists, getLatestSongs, getLivePromotions, getSelection, getTopWeek, getUpcomingEvents } from "@/lib/data";
import PromoStrip from "@/components/PromoStrip";
import { ArticleCard, ArtistCard, EmptyState, EventCard, SectionHead, toSongRow } from "@/components/Cards";
import SongList from "@/components/SongList";
import { IconCheck } from "@/components/icons";
import { PACKS, SITE } from "@/lib/site";
import { formatPrice, todayLong } from "@/lib/format";
import HomeHero from "@/components/HomeHero";
import Carousel from "@/components/Carousel";
import Image from "next/image";
import { GGU, GGU3 } from "@/lib/photos";

export const revalidate = 300;

export default async function HomePage() {
  const [top, latest, artists, events, articles, promotions, selection] = await Promise.all([
    getTopWeek(5),
    getLatestSongs(6),
    getFeaturedArtists(8),
    getUpcomingEvents({ limit: 4 }),
    getArticles({ limit: 4 }),
    getLivePromotions(3),
    getSelection(6),
  ]);
  const chart = top.length >= 3 ? top : latest.slice(0, 5);
  const chartIsTop = top.length >= 3;


  return (
    <>
      {/* ===== Ouverture : une de média ===== */}
      <HomeHero article={articles[0] ?? null} today={todayLong()} />

      {/* ===== À écouter ===== */}
      <section id="ecouter" className="container-x pt-12">
        <SectionHead
          eyebrow={chartIsTop ? "Top 5 de la semaine" : "À écouter"}
          title={chartIsTop ? "Les titres du moment" : "Dernières sorties"}
          link={{ href: "/artistes", label: "Tous les artistes" }}
        />
        <div className="rounded-[var(--radius-card)] bg-white p-2 sm:p-4">
          {chart.length > 0 ? (
            <SongList songs={chart.map(toSongRow)} ranked={chartIsTop} />
          ) : (
            <p className="px-2 py-10 text-center text-mute">Les premiers titres arrivent très bientôt.</p>
          )}
        </div>
        <p className="mt-3 text-sm text-mute">{chartIsTop ? "Classement établi sur les écoutes réelles de l'application MGS." : "Écoutez ici, ou dans l'application MGS."}</p>
      </section>

      {/* ===== Mises en avant programmées ===== */}
      <PromoStrip promotions={promotions} />

      {/* ===== Sélection MGS ===== */}
      {selection.length > 0 && (
        <section className="container-x pt-12">
          <SectionHead eyebrow="Sélection MGS" title="Nos coups de cœur" />
          <div className="rounded-[var(--radius-card)] bg-white p-2 sm:p-4">
            <SongList songs={selection.map(toSongRow)} />
          </div>
        </section>
      )}

      {/* ===== Artistes ===== */}
      <section className="container-x pt-12 pb-16">
        <SectionHead eyebrow="Artistes à la une" title="Ceux qui portent le gospel" link={{ href: "/artistes", label: "Tous les artistes" }} />
        {artists.length > 0 ? (
          <Carousel label="Artistes à la une">
            {artists.map((a) => (
              <div key={a.id} className="w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-5*1rem)/6)]">
                <ArtistCard artist={a} />
              </div>
            ))}
          </Carousel>
        ) : (
          <EmptyState title="Les fiches artistes arrivent" text="Vous êtes artiste gospel ? Envoyez-nous votre projet pour apparaître ici." action={{ href: "/soumettre", label: "Soumettre un projet" }} />
        )}
      </section>

      {/* ===== Festival GGU ===== */}
      <section className="bg-ink py-16 text-white">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-orchid">Organisé par MGS</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Galsen Gospel Urbain</h2>
              <p className="mt-5 max-w-xl text-lg text-haze">
                Le festival du gospel urbain à Dakar. La 3e édition, en décembre dernier, a réuni artistes et public autour du GGU Chill et du grand concert, avec une nouvelle génération d&apos;artistes gospel.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/galsen-gospel-urbain" className="btn-light">Découvrir le festival</Link>
                <a href={GGU.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white">Instagram du GGU</a>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {/* artistes du GGU 3 au micro (le clip est déjà en haut de page) */}
              <div className="relative col-span-4 aspect-[16/8] overflow-hidden rounded-[var(--radius-card)]">
                <Image src={GGU3.collectifMicros.src} alt={GGU3.collectifMicros.alt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
              </div>
              {[GGU3.artiste1, GGU3.rapStar, GGU3.auricia, GGU3.lhebreux].map((ph) => (
                <div key={ph.src} className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]">
                  <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 1024px) 12vw, 22vw" className="object-cover object-top" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Calendrier ===== */}
      <section className="relative overflow-hidden bg-aubergine py-16 text-white">
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-[480px] rounded-full bg-plum/40 blur-[110px]" />
        <div className="container-x">
          <div className="relative">
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
        </div>
      </section>

      {/* ===== Actualités ===== */}
      <section className="container-x py-16">
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
      <section className="border-y border-line bg-white py-16">
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
