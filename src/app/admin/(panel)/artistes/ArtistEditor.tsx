"use client";

import { useActionState } from "react";
import { updateArtist, type AdminState } from "../../actions";

export type ArtistRow = {
  id: string; user_id: string; slug: string; bio: string; verified: boolean; featured: boolean;
  social_facebook: string; social_instagram: string; social_tiktok: string; social_youtube: string;
  profiles: { full_name: string; avatar_url: string; country: string } | null;
};

/** Fiche artiste éditée par l'équipe : la plupart des artistes n'ont encore aucune présence en ligne. */
export default function ArtistEditor({ artist }: { artist: ArtistRow }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(updateArtist, {});
  const p = artist.profiles;
  return (
    <form action={action} className="grid gap-4 md:grid-cols-[140px_1fr]">
      <input type="hidden" name="id" value={artist.id} />
      <input type="hidden" name="user_id" value={artist.user_id} />
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p?.avatar_url ? <img src={p.avatar_url} alt="" className="aspect-square w-full rounded-xl object-cover" /> : <div className="aspect-square w-full rounded-xl bg-plum" />}
        <input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Nouvelle photo" className="mt-2 block w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-plum file:px-3 file:py-1.5 file:text-white" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="label">Nom</span><input name="full_name" defaultValue={p?.full_name} required maxLength={80} className="field py-2.5" /></label>
        <label className="block"><span className="label">Pays</span><input name="country" defaultValue={p?.country} maxLength={60} className="field py-2.5" placeholder="Sénégal" /></label>
        <label className="block sm:col-span-2"><span className="label">Biographie</span><textarea name="bio" defaultValue={artist.bio} rows={5} maxLength={5000} className="field py-2.5" /></label>
        <label className="block"><span className="label">Facebook</span><input name="social_facebook" defaultValue={artist.social_facebook} className="field py-2.5" placeholder="https://facebook.com/…" /></label>
        <label className="block"><span className="label">Instagram</span><input name="social_instagram" defaultValue={artist.social_instagram} className="field py-2.5" placeholder="https://instagram.com/…" /></label>
        <label className="block"><span className="label">TikTok</span><input name="social_tiktok" defaultValue={artist.social_tiktok} className="field py-2.5" placeholder="https://tiktok.com/@…" /></label>
        <label className="block"><span className="label">YouTube</span><input name="social_youtube" defaultValue={artist.social_youtube} className="field py-2.5" placeholder="https://youtube.com/…" /></label>
        <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={artist.featured} className="size-4 accent-[var(--color-plum)]" /> À la une sur l&apos;accueil</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="verified" defaultChecked={artist.verified} className="size-4 accent-[var(--color-plum)]" /> Badge vérifié</label>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button type="submit" disabled={pending} className="btn-primary min-h-10 disabled:opacity-60">{pending ? "Enregistrement…" : "Enregistrer"}</button>
          <a href={`/artistes/${artist.slug}`} target="_blank" className="text-sm text-plum underline">Voir la fiche publique</a>
          {state.message && <span className="text-sm text-plum" role="status">{state.message}</span>}
          {state.error && <span className="text-sm text-red-700" role="alert">{state.error}</span>}
        </div>
      </div>
    </form>
  );
}
