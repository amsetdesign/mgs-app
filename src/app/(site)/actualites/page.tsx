import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/data";
import { ArticleCard, EmptyState } from "@/components/Cards";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/labels";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Actualités gospel",
  description: "Interviews, sorties, témoignages et culture chrétienne : l'actualité du gospel au Sénégal et en Afrique francophone.",
  alternates: { canonical: "/actualites" },
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ rubrique?: string }> }) {
  const { rubrique } = await searchParams;
  const current = rubrique && rubrique in ARTICLE_CATEGORIES ? (rubrique as ArticleCategory) : undefined;
  const articles = await getArticles({ category: current, limit: 48 });

  return (
    <>
      <section className="bg-ink pt-16 pb-12 text-white">
        <div className="container-x">
          <p className="eyebrow text-orchid">Actualités</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">{current ? ARTICLE_CATEGORIES[current] : "Le journal du gospel"}</h1>
          <nav aria-label="Rubriques" className="mt-9 flex flex-wrap gap-2">
            <Link href="/actualites" aria-current={!current ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm ${!current ? "bg-white text-ink" : "border border-white/20 text-haze hover:text-white"}`}>Tout</Link>
            {(Object.keys(ARTICLE_CATEGORIES) as ArticleCategory[]).map((c) => (
              <Link key={c} href={`/actualites?rubrique=${c}`} aria-current={current === c ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm ${current === c ? "bg-white text-ink" : "border border-white/20 text-haze hover:text-white"}`}>
                {ARTICLE_CATEGORIES[c]}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className="container-x py-14">
        {articles.length > 0 ? (
          <>
            <ArticleCard article={articles[0]} large />
            <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(1).map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </>
        ) : (
          <EmptyState title="Aucun article dans cette rubrique pour l'instant" text="Revenez bientôt, ou inscrivez-vous à la newsletter en bas de page pour être prévenu." />
        )}
      </section>
    </>
  );
}
