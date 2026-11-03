import Link from "next/link";
import { getArticles, getFeaturedArtists, getLatestSongs, getLivePromotions, getSelection, getTopWeek, getUpcomingEvents } from "@/lib/data";
import PromoStrip from "@/components/PromoStrip";
import { ArtistCard, EmptyState, SectionHead, toSongRow } from "@/components/Cards";
import SongList from "@/components/SongList";
import { IconArrow, IconCheck } from "@/components/icons";
import { PACKS } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import HomeHero from "@/components/HomeHero";
import Carousel from "@/components/Carousel";
import AppPromo from "@/components/AppPromo";
import { EventsBlock, NewsBlock } from "@/components/HomeSections";
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
      <HomeHero />

      {/* ===== À écouter : carte colorée sur fond clair ===== */}
      <div className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute -top-24 -left-24 -z-10 size-[420px] rounded-full bg-orchid/40 blur-[110px]" />
        <div aria-hidden className="absolute top-[40%] -right-32 -z-10 size-[460px] rounded-full bg-plum/20 blur-[120px]" />
      <section id="ecouter" className="container-x pt-12">
        <SectionHead
          eyebrow={chartIsTop ? "Top 5 de la semaine" : "À écouter"}
          title={chartIsTop ? "Les titres du moment" : "Dernières sorties"}
          link={{ href: "#app", label: "Écouter dans l'app" }}
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col rounded-[var(--radius-card)] bg-gradient-to-br from-plum to-[#3c096c] p-2 text-white shadow-[0_20px_40px_-20px_rgb(128_0_128/0.6)] sm:p-4">
            {chart.length > 0 ? (
              <SongList songs={chart.map(toSongRow)} ranked={chartIsTop} dark />
            ) : (
              <p className="px-2 py-10 text-center text-white/80">Les premiers titres arrivent très bientôt.</p>
            )}
            <div className="mt-auto flex flex-wrap gap-2 px-2 pt-4 pb-1">
              {chart[0] && <Link href={`/titres/${chart[0].id}`} className="btn min-h-10 bg-white px-5 text-plum hover:bg-orchid">Paroles et détails</Link>}
              <Link href="/artistes" className="btn min-h-10 bg-white/15 px-5 text-white hover:bg-white/25">Tous les artistes</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line">
            <div>
              <p className="font-display text-lg font-bold">Vous êtes artiste ?</p>
              <p className="mt-1 text-sm text-mute">Publiez vos titres dans l&apos;application ou faites connaître votre nouvelle sortie sur nos plateformes.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/soumettre" className="btn-primary min-h-10 px-5">Soumettre un projet</Link>
              <Link href="/services" className="btn min-h-10 bg-orchid/40 px-5 text-plum-700 hover:bg-orchid">Voir les packs</Link>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-mute">{chartIsTop ? "Classement établi sur les écoutes réelles de l'application MGS." : "Cliquez sur une pochette pour écouter ici, ou retrouvez tout dans l'application MGS."}</p>
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
      </div>

      {/* ===== Festival GGU ===== */}
      <section className="relative isolate overflow-hidden bg-ink py-16 text-white">
        <div aria-hidden className="absolute -top-32 -left-24 -z-10 size-[460px] rounded-full bg-plum/45 blur-[120px]" />
        <div aria-hidden className="absolute -right-24 -bottom-40 -z-10 size-[440px] rounded-full bg-[#1f9d55]/25 blur-[120px]" />
        <div aria-hidden className="absolute top-1/3 right-1/3 -z-10 size-[300px] rounded-full bg-[#f2b705]/10 blur-[110px]" />
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-orchid">Organisé par MGS</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Galsen Gospel Urbain</h2>
              <ul className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                <li className="rounded-full bg-plum px-3 py-1.5">3e édition</li>
                <li className="rounded-full bg-[#1f9d55] px-3 py-1.5">26 – 28 décembre 2025</li>
                <li className="rounded-full bg-[#f2b705] px-3 py-1.5 text-ink">Entrée gratuite</li>
                <li className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">Centre culturel Blaise Senghor</li>
              </ul>
              <p className="mt-5 max-w-xl text-lg text-haze">
                Le festival du gospel urbain à Dakar, sur le thème « Différents mais tous utiles » : le GGU Chill et le grand concert, avec une nouvelle génération d&apos;artistes gospel.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/galsen-gospel-urbain" className="btn-primary">Découvrir le festival <IconArrow className="size-4" /></Link>
                <a href={GGU.instagram} target="_blank" rel="noopener noreferrer" className="btn bg-orchid px-6 text-ink hover:bg-white">Instagram du GGU</a>
                <Link href="/contact?sujet=partenariat" className="btn-ghost text-white">Devenir partenaire</Link>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {/* artistes du GGU 3 au micro (le clip est déjà en haut de page) */}
              <Link href="/galsen-gospel-urbain" className="group relative col-span-4 aspect-[16/8] overflow-hidden rounded-[var(--radius-card)] ring-2 ring-transparent transition-shadow hover:ring-orchid">
                <Image src={GGU3.collectifMicros.src} alt={GGU3.collectifMicros.alt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute top-3 left-3 rounded-full bg-plum px-3 py-1 text-xs font-semibold shadow">Grand concert</span>
              </Link>
              {[GGU3.bellusAnneaux, GGU3.vesteRouge, GGU3.costume, GGU3.sweatBordeaux].map((ph, i) => (
                <div key={ph.src} className={`relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] ring-2 ${["ring-plum", "ring-[#1f9d55]", "ring-[#f2b705]", "ring-orchid"][i]}`}>
                  <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 1024px) 12vw, 22vw" className={`object-cover ${ph.h > ph.w ? "origin-[50%_30%] scale-[1.45] object-[50%_30%]" : "object-[50%_25%]"}`} />
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
            <EventsBlock events={events} />
          ) : (
            <EmptyState dark title="Aucun événement annoncé pour l'instant" text="Organisateurs : annoncez votre concert, veillée ou festival. Le calendrier aide toute la communauté à éviter les dates en double." action={{ href: "/evenements/soumettre", label: "Annoncer un événement" }} />
          )}
          </div>
        </div>
      </section>

      {/* ===== Actualités ===== */}
      <div className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute -top-20 -right-24 -z-10 size-[420px] rounded-full bg-orchid/40 blur-[110px]" />
        <div aria-hidden className="absolute bottom-0 -left-32 -z-10 size-[380px] rounded-full bg-[#f2b705]/15 blur-[110px]" />
      <section className="container-x py-16">
        <SectionHead eyebrow="Actualités" title="Le gospel, ici et maintenant" link={{ href: "/actualites", label: "Toutes les actualités" }} />
        {articles.length > 0 ? (
          <NewsBlock articles={articles} />
        ) : (
          <EmptyState title="Les premiers articles arrivent" text="Interviews, sorties, témoignages : l'actualité du gospel sénégalais sera publiée ici." />
        )}
      </section>

      </div>

      {/* ===== Packs ===== */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#f6ecf6] to-paper py-16">
        <div aria-hidden className="absolute -bottom-32 left-1/3 -z-10 size-[420px] rounded-full bg-plum/15 blur-[120px]" />
        <div className="container-x">
          <SectionHead eyebrow="Promotion" title="Faites connaître votre projet" link={{ href: "/services", label: "Détail des packs" }} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PACKS.map((p) => (
              <div key={p.id} className={`relative flex flex-col overflow-hidden rounded-[var(--radius-card)] p-6 shadow-[0_14px_30px_-20px_rgb(128_0_128/0.5)] ${p.id === "premium" ? "bg-gradient-to-br from-plum to-[#3c096c] text-white" : "bg-white"}`}>
                <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 ${{ gratuit: "bg-[#1f9d55]", boost: "bg-[#f2b705]", premium: "bg-orchid", accompagnement: "bg-plum" }[p.id]}`} />
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
      <AppPromo />
    </>
  );
}
