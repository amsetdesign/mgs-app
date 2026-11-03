"use client";

import { useActionState } from "react";
import { saveArticle, type AdminState } from "../../actions";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/labels";

export type ArticleDraft = {
  id?: string; title: string; slug: string; excerpt: string; body: string; cover_url: string;
  category: ArticleCategory; artist_id: string | null; status: "draft" | "published";
};

export default function ArticleForm({ article, artists }: { article?: ArticleDraft; artists: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveArticle, {});
  const a = article;
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {a?.id && <input type="hidden" name="id" value={a.id} />}
      <div className="space-y-5">
        <label className="block">
          <span className="label">Titre</span>
          <input name="title" required maxLength={160} defaultValue={a?.title} className="field font-display text-xl font-semibold" />
        </label>
        <label className="block">
          <span className="label">Chapô (résumé affiché sous le titre et dans Google)</span>
          <textarea name="excerpt" rows={2} maxLength={300} defaultValue={a?.excerpt} className="field" />
        </label>
        <label className="block">
          <span className="label">Texte de l&apos;article</span>
          <textarea name="body" rows={22} defaultValue={a?.body} className="field font-mono text-sm leading-relaxed" />
          <span className="mt-2 block text-xs leading-relaxed text-mute">
            Laissez une ligne vide entre les paragraphes. « ## » en début de ligne pour un intertitre, « - » pour une liste, « &gt; » pour une citation,
            **gras**, [texte du lien](https://…). Collez un lien YouTube seul sur sa ligne pour intégrer la vidéo.
          </span>
        </label>
      </div>
      <aside className="space-y-5">
        <div className="space-y-4 rounded-[var(--radius-card)] bg-white p-5">
          <label className="block">
            <span className="label">État</span>
            <select name="status" defaultValue={a?.status ?? "draft"} className="field py-2.5">
              <option value="draft">Brouillon (invisible)</option>
              <option value="published">Publié</option>
            </select>
          </label>
          <label className="block">
            <span className="label">Rubrique</span>
            <select name="category" defaultValue={a?.category ?? "news"} className="field py-2.5">
              {(Object.keys(ARTICLE_CATEGORIES) as ArticleCategory[]).map((c) => <option key={c} value={c}>{ARTICLE_CATEGORIES[c]}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="label">Artiste lié</span>
            <select name="artist_id" defaultValue={a?.artist_id ?? ""} className="field py-2.5">
              <option value="">Aucun</option>
              {artists.map((ar) => <option key={ar.id} value={ar.id}>{ar.name}</option>)}
            </select>
            <span className="mt-1 block text-xs text-mute">L&apos;article apparaîtra aussi sur sa fiche.</span>
          </label>
          <label className="block">
            <span className="label">Adresse (facultatif)</span>
            <input name="slug" defaultValue={a?.slug} maxLength={120} className="field py-2.5 text-sm" placeholder="générée depuis le titre" />
          </label>
        </div>
        <div className="space-y-3 rounded-[var(--radius-card)] bg-white p-5">
          <span className="label">Image de couverture</span>
          {a?.cover_url && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.cover_url} alt="" className="aspect-[16/10] w-full rounded-xl object-cover" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remove_cover" /> Retirer l&apos;image</label>
            </>
          )}
          <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-plum file:px-4 file:py-2 file:text-white" />
          <span className="block text-xs text-mute">Une vraie photo de l&apos;artiste ou de l&apos;événement. JPG, PNG ou WEBP, 5 Mo maximum.</span>
        </div>
        {state.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Enregistrement…" : "Enregistrer"}</button>
      </aside>
    </form>
  );
}
