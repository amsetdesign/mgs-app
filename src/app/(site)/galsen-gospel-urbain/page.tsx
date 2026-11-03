import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GGU, GGU3, SUNU_IMPACT, type Photo } from "@/lib/photos";
import { YoutubeEmbed } from "@/components/ArticleBody";
import { IconInstagram, IconTiktok } from "@/components/icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Galsen Gospel Urbain (GGU), le festival du gospel urbain à Dakar",
  description:
    "Le Galsen Gospel Urbain, festival organisé par Music Gospel Sénégal : retour en photos et en vidéo sur la 3e édition, le GGU Chill et le grand concert.",
  alternates: { canonical: "/galsen-gospel-urbain" },
  openGraph: { images: [GGU3.heroStage.src] },
};

function Shot({ photo, className = "", sizes = "(min-width: 1024px) 33vw, 50vw" }: { photo: Photo; className?: string; sizes?: string }) {
  return (
    <figure className={`relative overflow-hidden rounded-[var(--radius-card)] bg-night ${className}`}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] hover:scale-[1.03]" />
    </figure>
  );
}

export default function GguPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Festival",
    name: GGU.name,
    alternateName: GGU.short,
    organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
    location: { "@type": "Place", name: "Dakar", address: { "@type": "PostalAddress", addressLocality: "Dakar", addressCountry: "SN" } },
    image: [`${SITE.url}${GGU3.heroStage.src}`],
    sameAs: [GGU.instagram, GGU.tiktok],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src={GGU3.sceneVerte.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-55" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="container-x flex min-h-[70vh] flex-col justify-end pt-32 pb-14">
          <p className="eyebrow text-orchid">Un festival Music Gospel Sénégal</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.8rem,8vw,6rem)] leading-[0.95] font-bold tracking-tight">Galsen Gospel Urbain</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            Le rendez-vous du gospel urbain à Dakar : rap, slam, chant et louange, portés par une nouvelle génération d&apos;artistes chrétiens.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={GGU.instagram} target="_blank" rel="noopener noreferrer" className="btn-light"><IconInstagram className="size-5" />Instagram</a>
            <a href={GGU.tiktok} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white"><IconTiktok className="size-5" />TikTok</a>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <p className="eyebrow text-plum">3e édition · décembre 2025</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Deux temps forts</h2>
            <div className="mt-6 space-y-6 text-lg leading-relaxed text-ink/85">
              <p><strong className="font-display">Le GGU Chill</strong> : une soirée intimiste où slameurs, rappeurs, chanteuses et guitaristes se sont succédé au plus près du public.</p>
              <p><strong className="font-display">Le grand concert</strong> : la scène, les lumières et toute une salle en louange pour clôturer le festival.</p>
            </div>
          </div>
          <YoutubeEmbed id={GGU.clip} title="Galsen Gospel Urbain, le clip du festival" />
        </div>
      </section>

      <section className="bg-ink py-20 text-white">
        <div className="container-x">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Le grand concert</h2>
          <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] lg:grid-cols-4">
            <Shot photo={GGU3.collectifMicros} className="col-span-2 row-span-2" sizes="(min-width: 1024px) 50vw, 100vw" />
            <Shot photo={GGU3.denim} className="row-span-2" />
            <Shot photo={GGU3.casquette} className="row-span-2" />
            <Shot photo={GGU3.costume} className="row-span-2" />
            <Shot photo={GGU3.vesteRouge} className="row-span-2" />
            <Shot photo={GGU3.heroStage} className="col-span-2 row-span-2" sizes="(min-width: 1024px) 50vw, 100vw" />
            <Shot photo={GGU3.vainqueur} className="row-span-2" />
            <Shot photo={GGU3.artiste3} className="row-span-2" />
            <Shot photo={GGU3.publicConcert} className="col-span-2 row-span-2" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Le GGU Chill</h2>
        <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] lg:grid-cols-4">
          <Shot photo={GGU3.rappeur} className="col-span-2 row-span-2" sizes="(min-width: 1024px) 50vw, 100vw" />
          <Shot photo={GGU3.laPlume} className="row-span-2" />
          <Shot photo={GGU3.guitare} className="row-span-2" />
          <Shot photo={GGU3.auricia} className="col-span-2" />
          <Shot photo={GGU3.chillScene2} />
          <Shot photo={GGU3.rapStar} />
          <Shot photo={GGU3.lhebreux} className="col-span-2" />
          <Shot photo={GGU3.chillPublic} className="col-span-2" />
        </div>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="container-x grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="eyebrow text-plum">Aussi organisé par MGS</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">{SUNU_IMPACT.name}</h2>
            <p className="mt-3 max-w-xl text-mute">Un festival organisé en partenariat avec l&apos;{SUNU_IMPACT.partner}.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a href={SUNU_IMPACT.instagram} target="_blank" rel="noopener noreferrer" className="btn-primary"><IconInstagram className="size-5" />Instagram du festival</a>
            <Link href="/contact?sujet=partenariat" className="btn-ghost">Devenir partenaire</Link>
          </div>
        </div>
      </section>
    </>
  );
}
