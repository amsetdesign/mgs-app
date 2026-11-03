import Image from "next/image";
import Link from "next/link";
import type { Article, EventItem, Song } from "@/lib/data";
import { artistName } from "@/lib/data";
import { ARTICLE_CATEGORIES, EVENT_CATEGORIES } from "@/lib/labels";
import { formatDate, formatTime } from "@/lib/format";
import { GGU, GGU3, type Photo } from "@/lib/photos";
import { IconArrow, IconCalendar, IconPin, IconPlay } from "./icons";

// Mur de photos de scène (vrais événements MGS) derrière l'ouverture
const WALL: Photo[] = [GGU3.sceneVerte, GGU3.denim, GGU3.casquette, GGU3.collectifMicros, GGU3.costume, GGU3.vesteRouge, GGU3.heroStage, GGU3.publicConcert];

type Props = { article: Article | null; nextEvent: EventItem | null; latestSong: Song | null; today: string };

/** Ouverture de l'accueil, façon une de média : date du jour, rubriques, sujet à la une. */
export default function HomeHero({ article, nextEvent, latestSong, today }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div aria-hidden className="absolute inset-0 -z-10 grid grid-cols-2 grid-rows-4 gap-1 opacity-80 sm:grid-cols-4 sm:grid-rows-2">
        {WALL.map((p, i) => (
          <div key={p.src} className={`relative overflow-hidden ${i > 3 ? "hidden sm:block" : ""}`}>
            <Image src={p.src} alt="" fill sizes="25vw" priority={i < 4} className="object-cover" />
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/75 to-ink/95 lg:bg-gradient-to-r lg:from-ink/95 lg:via-ink/75 lg:to-[#2a0b31]/45" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink to-transparent" />

      {/* bandeau de la une : date et rubriques, comme un journal */}
      <div className="border-b border-white/10">
        <div className="container-x flex h-11 items-center justify-between gap-4 text-xs">
          <p className="font-semibold tracking-wide text-white/80 uppercase first-letter:uppercase">{today}</p>
          <nav aria-label="Rubriques" className="hidden gap-5 text-haze sm:flex">
            <Link href="/actualites?rubrique=sortie" className="hover:text-white">Sorties</Link>
            <Link href="/actualites?rubrique=interview" className="hover:text-white">Interviews</Link>
            <Link href="/evenements" className="hover:text-white">Agenda</Link>
            <Link href="/galsen-gospel-urbain" className="hover:text-white">Festival GGU</Link>
          </nav>
        </div>
      </div>

      <div className="container-x grid gap-10 pt-14 pb-16 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:pt-20 lg:pb-20">
        <div>
          <p className="eyebrow text-orchid">Média · Musique · Événements</p>
          <h1 className="mt-5 font-display text-[clamp(2.7rem,7.2vw,5.4rem)] leading-[0.95] font-bold tracking-tight">
            La voix du gospel <span className="text-orchid">au Sénégal.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Sorties, artistes, concerts et festivals : MGS raconte et fait grandir la scène gospel du Sénégal et de la francophonie.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/actualites" className="btn-light">Lire l&apos;actualité <IconArrow className="size-4" /></Link>
            <Link href="/soumettre" className="btn-primary">Faire connaître mon projet</Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-white/70">À la une</p>
          {article ? (
            <Link href={`/actualites/${article.slug}`} className="group block overflow-hidden rounded-[24px] bg-night/80 ring-1 ring-white/10 backdrop-blur">
              <div className="relative aspect-[16/9] overflow-hidden">
                {article.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.cover_url} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                ) : (
                  <Image src={GGU3.sceneVerte.src} alt="" fill sizes="40vw" className="object-cover" />
                )}
              </div>
              <div className="p-5">
                <p className="eyebrow text-orchid">{ARTICLE_CATEGORIES[article.category]}</p>
                <p className="mt-2 font-display text-2xl leading-snug font-bold group-hover:underline">{article.title}</p>
                <p className="mt-2 text-sm text-haze">{formatDate(article.published_at)}</p>
              </div>
            </Link>
          ) : (
            <Link href="/galsen-gospel-urbain" className="group block overflow-hidden rounded-[24px] bg-night/80 ring-1 ring-white/10 backdrop-blur">
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${GGU.clip}/maxresdefault.jpg`} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-plum shadow-lg"><IconPlay className="ml-1 size-7" /></span>
                </span>
              </div>
              <div className="p-5">
                <p className="eyebrow text-orchid">Festival · Décembre 2025</p>
                <p className="mt-2 font-display text-2xl leading-snug font-bold group-hover:underline">Revivez le Galsen Gospel Urbain 3</p>
                <p className="mt-2 text-sm text-haze">Le clip officiel, les photos et les artistes de la 3e édition.</p>
              </div>
            </Link>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {latestSong && (
              <Link href={`/titres/${latestSong.id}`} className="flex items-center gap-3 rounded-2xl bg-night/80 p-3 ring-1 ring-white/10 backdrop-blur hover:bg-night-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {latestSong.cover_url ? <img src={latestSong.cover_url} alt="" className="size-12 rounded-lg object-cover" /> : <span className="size-12 rounded-lg bg-plum" />}
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tracking-wide text-orchid uppercase">Nouvelle sortie</span>
                  <span className="block truncate font-medium">{latestSong.title}</span>
                  <span className="block truncate text-xs text-haze">{artistName(latestSong.artists)}</span>
                </span>
              </Link>
            )}
            {nextEvent ? (
              <Link href={`/evenements/${nextEvent.slug}`} className="flex items-center gap-3 rounded-2xl bg-night/80 p-3 ring-1 ring-white/10 backdrop-blur hover:bg-night-2">
                <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-ink leading-none">
                  <span className="font-display text-lg font-bold">{formatDate(nextEvent.starts_at, { day: "2-digit" })}</span>
                  <span className="text-[10px] font-semibold uppercase">{formatDate(nextEvent.starts_at, { month: "short" }).replace(".", "")}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tracking-wide text-orchid uppercase">{EVENT_CATEGORIES[nextEvent.category]}</span>
                  <span className="block truncate font-medium">{nextEvent.title}</span>
                  <span className="flex items-center gap-1 truncate text-xs text-haze"><IconPin className="size-3" />{nextEvent.city} · {formatTime(nextEvent.starts_at)}</span>
                </span>
              </Link>
            ) : (
              <Link href="/evenements/soumettre" className="flex items-center gap-3 rounded-2xl bg-night/80 p-3 ring-1 ring-white/10 backdrop-blur hover:bg-night-2">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/10"><IconCalendar className="size-6 text-orchid" /></span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tracking-wide text-orchid uppercase">Agenda gospel</span>
                  <span className="block font-medium">Annoncez votre événement</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Bandeau défilant « En ce moment » sous l'ouverture (s'arrête au survol et si l'animation est réduite). */
export function NewsTicker({ items }: { items: { label: string; text: string; href: string }[] }) {
  if (items.length === 0) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={`${it.href}-${i}`} className="flex items-center gap-3 whitespace-nowrap">
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase">{it.label}</span>
          <Link href={it.href} tabIndex={hidden ? -1 : undefined} className="text-sm hover:underline">{it.text}</Link>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="flex items-stretch bg-plum text-white">
      <p className="relative z-10 flex shrink-0 items-center bg-ink px-4 text-xs font-bold tracking-[0.18em] uppercase sm:px-6">En ce moment</p>
      <div className="ticker group flex min-w-0 flex-1 overflow-hidden py-3">
        <div className="ticker-track flex group-hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

export const tickerDate = (iso: string) => formatDate(iso, { day: "numeric", month: "long" });
export const songLabel = (s: Song) => `${s.title} · ${artistName(s.artists)}`;
