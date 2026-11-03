import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/data";
import { ARTICLE_CATEGORIES } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { GGU, GGU3, type Photo } from "@/lib/photos";
import YoutubeFacade from "./YoutubeFacade";
import { IconArrow, IconCalendar } from "./icons";

// Artistes au micro sur la scène du GGU 3, fondus les uns dans les autres (position, taille, opacité)
const WALL: { photo: Photo; cls: string }[] = [
  // visages placés hors du bloc vidéo : bord droit et espace entre le texte et le bloc
  { photo: GGU3.casquette, cls: "right-[-5%] top-[-6%] h-[112%] w-[28%] opacity-90" },
  { photo: GGU3.vesteRouge, cls: "left-[38%] top-[-6%] h-[104%] w-[22%] opacity-80 hidden lg:block" },
  { photo: GGU3.costume, cls: "left-[-8%] top-[-14%] h-[90%] w-[30%] opacity-35 hidden sm:block" },
  { photo: GGU3.rappeur, cls: "left-[-6%] bottom-[-24%] h-[70%] w-[36%] opacity-30 hidden sm:block" },
];

// fondu sur tous les bords : les photos se mêlent au fond sans cadre visible
const FADE = {
  WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 45%, #000 30%, transparent 98%)",
  maskImage: "radial-gradient(ellipse 50% 50% at 50% 45%, #000 30%, transparent 98%)",
  mixBlendMode: "lighten",
} as const;

type Props = { article: Article | null };

/** Ouverture de l'accueil, façon une de média : date du jour, rubriques, clip du moment. */
export default function HomeHero({ article }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {WALL.map(({ photo, cls }, i) => (
          <div key={photo.src} className={`absolute ${cls}`} style={FADE}>
            <Image src={photo.src} alt="" fill sizes="45vw" priority={i < 3} className="object-cover object-top" />
          </div>
        ))}
        <div className="absolute top-1/3 right-1/4 size-[520px] rounded-full bg-plum/30 blur-[120px]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/60 to-ink/95 lg:bg-gradient-to-r lg:from-ink lg:via-ink/55 lg:to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="container-x grid gap-10 pt-14 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-24 lg:pt-20 lg:pb-24">
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
          <div className="rounded-[24px] bg-night/85 p-3 ring-1 ring-white/10 backdrop-blur sm:p-4">
            <p className="eyebrow px-1 pb-3 text-orchid">Son du moment</p>
            <YoutubeFacade id={GGU.clip} title="Différents mais tous utiles · clip officiel du GGU 3" caption={false} />
            <div className="flex items-center justify-between gap-3 px-1 pt-3">
              <span className="min-w-0">
                <span className="block truncate font-medium">Différents mais tous utiles</span>
                <span className="block truncate text-xs text-haze">Les artistes du Galsen Gospel Urbain 3</span>
              </span>
              <Link href="/galsen-gospel-urbain" className="shrink-0 text-xs font-semibold text-orchid hover:underline">Le festival</Link>
            </div>
          </div>
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
