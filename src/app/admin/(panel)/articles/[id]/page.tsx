import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import ArticleForm, { type ArticleDraft } from "../ArticleForm";
import { artistOptions } from "../options";
import { deleteArticle } from "../../../actions";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data }, artists] = await Promise.all([
    supabase.from("articles").select("id, title, slug, excerpt, body, cover_url, category, artist_id, status").eq("id", id).maybeSingle(),
    artistOptions(),
  ]);
  if (!data) notFound();
  return (
    <div className="space-y-6">
      <Link href="/admin/articles" className="text-sm text-mute hover:underline">Articles</Link>
      <h1 className="font-display text-3xl font-bold tracking-tight">Modifier l&apos;article</h1>
      <ArticleForm article={data as ArticleDraft} artists={artists} />
      <form action={deleteArticle} className="border-t border-line pt-6">
        <input type="hidden" name="id" value={id} />
        <button className="text-sm text-red-700 underline">Supprimer définitivement cet article</button>
      </form>
    </div>
  );
}
