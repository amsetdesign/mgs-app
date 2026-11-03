import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: "Music Gospel Sénégal est une plateforme médiatique chrétienne dédiée à la promotion du gospel, des artistes et des événements au Sénégal et dans la francophonie.",
  alternates: { canonical: "/a-propos" },
};

const MISSION = [
  { title: "Promouvoir", text: "Mettre en avant les artistes gospel, leurs sorties, leurs clips et leurs concerts." },
  { title: "Rassembler", text: "Offrir un espace unique où artistes, églises, organisateurs et public se retrouvent." },
  { title: "Coordonner", text: "Tenir un calendrier gospel national pour éviter les chevauchements et mieux mobiliser." },
  { title: "Inspirer", text: "Porter un média moderne, centré sur Jésus-Christ et sur l'impact culturel chrétien." },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    alternateName: SITE.short,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo.png`,
    email: SITE.email,
    sameAs: Object.values(SITE.socials).filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="bg-ink pt-16 pb-16 text-white">
        <div className="container-x max-w-4xl">
          <p className="eyebrow text-orchid">À propos</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight sm:text-6xl">Plus qu&apos;un média, une mission.</h1>
          <p className="mt-6 text-xl leading-relaxed text-haze">
            Music Gospel Sénégal est une plateforme médiatique chrétienne dédiée à la promotion du gospel, des artistes chrétiens, des événements et de l&apos;actualité gospel au Sénégal et dans la francophonie.
          </p>
        </div>
      </section>

      <section className="container-x max-w-5xl py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow text-plum">Vision</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">Le média gospel de référence au Sénégal</h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-ink/85">
            <p>Le gospel sénégalais a des voix, des chorales, des groupes et des événements d&apos;une grande richesse. Il lui manquait un lieu pour être vu, écouté et partagé.</p>
            <p>MGS veut devenir une plateforme de visibilité pour les artistes, un espace de coordination des événements et un pont entre les artistes, les églises et le public, au Sénégal comme dans toute l&apos;Afrique francophone et la diaspora.</p>
          </div>
        </div>

        <div className="mt-20">
          <p className="eyebrow text-plum">Mission</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {MISSION.map((m, i) => (
              <div key={m.title} className="rounded-[var(--radius-card)] bg-white p-7">
                <p className="font-display text-sm font-bold text-plum">0{i + 1}</p>
                <p className="mt-2 font-display text-2xl font-bold">{m.title}</p>
                <p className="mt-2 text-mute">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-plum py-16 text-white">
        <div className="container-x flex max-w-5xl flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Rejoindre l&apos;aventure</h2>
            <p className="mt-2 max-w-xl text-white/85">Artiste, église, organisateur, partenaire : chacun a sa place pour faire grandir le gospel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/soumettre" className="btn-light">Soumettre un projet</Link>
            <Link href="/contact?sujet=partenariat" className="btn-ghost text-white">Devenir partenaire</Link>
          </div>
        </div>
      </section>
    </>
  );
}
