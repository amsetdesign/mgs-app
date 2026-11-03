import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/data";
import { ArticleCard } from "@/components/Cards";
import ArticleBody from "@/components/ArticleBody";
import { ARTICLE_CATEGORIES } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.excerpt || undefined,
    alternates: { canonical: `/actualites/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt || undefined, publishedTime: article.published_at, images: article.cover_url ? [article.cover_url] : undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const related = (await getArticles({ category: article.category, limit: 4 })).filter((a) => a.id !== article.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.published_at,
    ...(article.cover_url ? { image: [article.cover_url] } : {}),
    ...(article.excerpt ? { description: article.excerpt } : {}),
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}/actualites/${article.slug}`,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="bg-ink pt-14 pb-10 text-white">
        <div className="container-x max-w-3xl">
          <Link href={`/actualites?rubrique=${article.category}`} className="eyebrow text-orchid hover:underline">{ARTICLE_CATEGORIES[article.category]}</Link>
          <h1 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight sm:text-5xl">{article.title}</h1>
          {article.excerpt && <p className="mt-5 text-lg text-haze">{article.excerpt}</p>}
          <p className="mt-6 text-sm text-haze">Publié le {formatDate(article.published_at)}</p>
        </div>
      </header>
      {article.cover_url && (
        <div className="container-x -mt-1 max-w-4xl pt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.cover_url} alt="" className="aspect-[16/9] w-full rounded-[var(--radius-card)] object-cover" />
        </div>
      )}
      <div className="container-x max-w-3xl py-12">
        <ArticleBody body={article.body} />
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] bg-white p-6">
          <p className="text-mute">Vous avez un projet gospel à faire connaître ?</p>
          <Link href="/soumettre" className="btn-primary">Soumettre un projet</Link>
        </div>
      </div>
      {related.length > 0 && (
        <section className="border-t border-line bg-white py-14">
          <div className="container-x">
            <h2 className="font-display text-2xl font-bold">À lire aussi</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
