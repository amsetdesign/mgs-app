import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GGU, GGU3, POSTERS, SUNU_IMPACT, type Photo } from "@/lib/photos";
import YoutubeFacade from "@/components/YoutubeFacade";
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
            <a href={GGU.site} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white">galsengospelurbain.com</a>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <p className="eyebrow text-plum">3e édition · du 26 au 28 décembre 2025</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">« Différents mais tous utiles »</h2>
            <p className="mt-3 text-mute">Centre culturel Blaise Senghor, Dakar · entrée gratuite</p>
            <div className="mt-6 space-y-6 text-lg leading-relaxed text-ink/85">
              <p><strong className="font-display">Le GGU Chill</strong>, vendredi 26 décembre : une soirée intimiste avec Rose Mban, le groupe Rap Star, Esther, La Plume, Pharel Stone, Bino de Jésus, Auricia, John d&apos;Arc et Adorata.</p>
              <p><strong className="font-display">Le grand concert</strong> : la scène, les lumières et toute une salle en louange pour clôturer le festival.</p>
            </div>
          </div>
          <YoutubeFacade id={GGU.clip} title="Galsen Gospel Urbain 3, le clip officiel" />
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

      <section className="bg-white py-20">
        <div className="container-x">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Les affiches</h2>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-4">
            {[POSTERS.ggu3, POSTERS.ggu3Chill].map((ph) => (
              <a key={ph.src} href={ph.src} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-paper">
                <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 768px) 360px, 50vw" className="object-cover" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-aubergine py-20 text-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow text-orchid">Aussi organisé par MGS · du 26 au 29 juin 2025</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{SUNU_IMPACT.name}</h2>
            <p className="mt-3 text-xl text-white/90">« Brille par ton talent »</p>
            <p className="mt-5 max-w-xl text-haze">
              Avec l&apos;{SUNU_IMPACT.partner}, au Centre culturel Blaise Senghor : panels et conférences, ateliers de formation, concert de danse, puis un concert de célébration le 29 juin avec Urbain Nassalang, Cathy Kassa, Fulgence Gackou, MAC et de nombreux artistes gospel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={SUNU_IMPACT.site} target="_blank" rel="noopener noreferrer" className="btn-light">sunuimpactfestival.com</a>
              <a href={SUNU_IMPACT.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white"><IconInstagram className="size-5" />Instagram</a>
              <Link href="/contact?sujet=partenariat" className="btn-ghost text-white">Devenir partenaire</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[POSTERS.sunu2025, POSTERS.sunu2025Concert].map((ph) => (
              <a key={ph.src} href={ph.src} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]">
                <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
