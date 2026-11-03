import Link from "next/link";
import ArticleForm from "../ArticleForm";
import { artistOptions } from "../options";

export default async function NewArticlePage() {
  const artists = await artistOptions();
  return (
    <div className="space-y-6">
      <Link href="/admin/articles" className="text-sm text-mute hover:underline">Articles</Link>
      <h1 className="font-display text-3xl font-bold tracking-tight">Nouvel article</h1>
      <ArticleForm artists={artists} />
    </div>
  );
}
