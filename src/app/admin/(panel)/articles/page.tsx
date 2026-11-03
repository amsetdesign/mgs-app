import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/labels";
import { formatDate } from "@/lib/format";

type Row = { id: string; slug: string; title: string; category: ArticleCategory; status: "draft" | "published"; published_at: string | null; updated_at: string };

export default async function AdminArticlesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("articles").select("id, slug, title, category, status, published_at, updated_at").order("updated_at", { ascending: false }).limit(300);
  const rows = (data ?? []) as Row[];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Articles</h1>
          <p className="mt-1 text-mute">Actualités, interviews, biographies, sorties : le blog de MGS.</p>
        </div>
        <Link href="/admin/articles/nouveau" className="btn-primary">Nouvel article</Link>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucun article. Commencez par une présentation d&apos;artiste ou une sortie récente.</p>
      ) : (
        <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.status === "published" ? "bg-emerald-100 text-emerald-900" : "bg-zinc-200 text-zinc-700"}`}>
                {r.status === "published" ? "Publié" : "Brouillon"}
              </span>
              <Link href={`/admin/articles/${r.id}`} className="min-w-0 flex-1 truncate font-medium hover:underline">{r.title}</Link>
              <span className="text-sm text-mute">{ARTICLE_CATEGORIES[r.category]}</span>
              <span className="w-32 text-right text-sm text-mute tabular-nums">{formatDate(r.published_at ?? r.updated_at, { day: "numeric", month: "short", year: "numeric" })}</span>
              {r.status === "published" && <Link href={`/actualites/${r.slug}`} target="_blank" className="text-sm text-plum underline">Voir</Link>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
