import type { Metadata } from "next";
import Link from "next/link";
import { getArtists } from "@/lib/data";
import { ArtistCard, EmptyState } from "@/components/Cards";
import { ZONES, zoneOf, type Zone } from "@/lib/zones";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Artistes gospel",
  description: "Les artistes gospel du Sénégal, d'Afrique et de la francophonie : biographies, titres à écouter, clips et prochains concerts.",
  alternates: { canonical: "/artistes" },
};

export default async function ArtistsPage({ searchParams }: { searchParams: Promise<{ zone?: string }> }) {
  const { zone } = await searchParams;
  const current = zone && zone in ZONES ? (zone as Zone) : null;
  const all = await getArtists();
  const artists = current ? all.filter((a) => zoneOf(a.profiles?.country) === current) : all;

  return (
    <>
      <section className="bg-ink pt-16 pb-12 text-white">
        <div className="container-x">
          <p className="eyebrow text-orchid">Artistes</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-6xl">Les voix du gospel</h1>
          <p className="mt-5 max-w-2xl text-lg text-haze">Biographies, titres, clips et concerts : chaque artiste a sa page, pour être enfin trouvé sur internet.</p>
          <nav aria-label="Filtrer par zone" className="mt-9 flex flex-wrap gap-2">
            <Link href="/artistes" aria-current={!current ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm ${!current ? "bg-white text-ink" : "border border-white/20 text-haze hover:text-white"}`}>Tous</Link>
            {(Object.keys(ZONES) as Zone[]).map((z) => (
              <Link key={z} href={`/artistes?zone=${z}`} aria-current={current === z ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm ${current === z ? "bg-white text-ink" : "border border-white/20 text-haze hover:text-white"}`}>
                {ZONES[z]}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className="container-x py-14">
        {artists.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {artists.map((a) => <ArtistCard key={a.id} artist={a} />)}
          </div>
        ) : (
          <EmptyState title="Aucun artiste dans cette catégorie pour l'instant" text="Vous êtes artiste ? Envoyez-nous votre projet pour avoir votre page sur MGS." action={{ href: "/soumettre", label: "Soumettre un projet" }} />
        )}
      </section>
    </>
  );
}
