import Image from "next/image";
import Link from "next/link";
import type { Article, Song } from "@/lib/data";
import { ARTICLE_CATEGORIES } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { GGU3, type Photo } from "@/lib/photos";
import { toSongRow } from "./Cards";
import SongList from "./SongList";
import { IconArrow, IconCalendar } from "./icons";

// Mur de photos : les artistes au micro sur la scène du GGU 3 (ce sont eux qu'on met en avant)
const WALL: Photo[] = [GGU3.casquette, GGU3.denim, GGU3.rappeur, GGU3.vesteRouge, GGU3.costume, GGU3.guitare, GGU3.laPlume, GGU3.artiste1];

type Props = { article: Article | null; latestSong: Song | null; today: string };

/** Ouverture de l'accueil, façon une de média : date du jour, rubriques, son du moment. */
export default function HomeHero({ article, latestSong, today }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div aria-hidden className="absolute inset-0 -z-10 grid grid-cols-2 grid-rows-4 gap-1 opacity-80 sm:grid-cols-4 sm:grid-rows-2">
        {WALL.map((p, i) => (
          <div key={p.src} className={`relative overflow-hidden ${i > 3 ? "hidden sm:block" : ""}`}>
            <Image src={p.src} alt="" fill sizes="25vw" priority={i < 4} className="object-cover object-top" />
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/75 to-ink/95 lg:bg-gradient-to-r lg:from-ink/95 lg:via-ink/70 lg:to-[#2a0b31]/40" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      {/* bandeau de la une : date et rubriques, comme un journal */}
      <div className="border-b border-white/10">
        <div className="container-x flex h-11 items-center justify-between gap-4 text-xs">
          <p className="font-semibold tracking-wide text-white/80 uppercase">{today}</p>
          <nav aria-label="Rubriques" className="hidden gap-5 text-haze sm:flex">
            <Link href="/artistes" className="hover:text-white">Artistes</Link>
            <Link href="/actualites?rubrique=sortie" className="hover:text-white">Sorties</Link>
            <Link href="/actualites?rubrique=interview" className="hover:text-white">Interviews</Link>
            <Link href="/evenements" className="hover:text-white">Agenda</Link>
          </nav>
        </div>
      </div>

      <div className="container-x grid gap-10 pt-16 pb-20 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:pt-24 lg:pb-24">
        <div>
          <p className="eyebrow text-orchid">Média · Musique · Artistes</p>
          <h1 className="mt-5 font-display text-[clamp(2.7rem,7.2vw,5.4rem)] leading-[0.95] font-bold tracking-tight">
            La voix du gospel <span className="text-orchid">au Sénégal.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Les artistes, leurs sorties et leurs scènes : MGS fait connaître et grandir les talents gospel du Sénégal et de la francophonie.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/artistes" className="btn-light">Découvrir les artistes <IconArrow className="size-4" /></Link>
            <Link href="/soumettre" className="btn-primary">Faire connaître mon projet</Link>
          </div>
        </div>

        <div className="space-y-3">
          {latestSong && (
            <div className="rounded-[24px] bg-night/85 p-3 ring-1 ring-white/10 backdrop-blur sm:p-4">
              <p className="eyebrow px-2 pb-1 text-orchid">Son du moment</p>
              <SongList songs={[toSongRow(latestSong)]} dark />
            </div>
          )}
          {article && (
            <Link href={`/actualites/${article.slug}`} className="group block rounded-[24px] bg-night/85 p-5 ring-1 ring-white/10 backdrop-blur hover:bg-night-2">
              <p className="eyebrow text-orchid">À la une · {ARTICLE_CATEGORIES[article.category]}</p>
              <p className="mt-2 font-display text-xl leading-snug font-bold group-hover:underline">{article.title}</p>
              <p className="mt-1 text-sm text-haze">{formatDate(article.published_at)}</p>
            </Link>
          )}
          <Link href="/evenements/soumettre" className="flex items-center gap-4 rounded-[24px] bg-night/85 p-4 ring-1 ring-white/10 backdrop-blur hover:bg-night-2">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10"><IconCalendar className="size-6 text-orchid" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold tracking-wide text-orchid uppercase">Agenda gospel</span>
              <span className="block font-medium">Annoncez votre événement</span>
            </span>
            <IconArrow className="size-4 text-haze" />
          </Link>
        </div>
      </div>
    </section>
  );
}
