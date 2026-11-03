"use client";

import { useActionState, useState } from "react";
import { createArtist, type AdminState } from "../../actions";

/** Fiche créée par l'équipe pour un artiste qui n'a pas encore de compte dans l'application. */
export default function NewArtistForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<AdminState, FormData>(createArtist, {});
  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">Nouvelle fiche artiste</button>
        {state.message && <span className="text-sm text-plum" role="status">{state.message}</span>}
      </div>
    );
  }
  return (
    <form action={action} className="grid gap-3 rounded-[var(--radius-card)] bg-white p-5 sm:grid-cols-2">
      <p className="text-sm text-mute sm:col-span-2">
        Pour un artiste qui n&apos;a pas encore de compte. Dès qu&apos;il s&apos;inscrit dans l&apos;application, rattachez la fiche à son compte : il pourra la gérer lui-même.
      </p>
      <label className="block"><span className="label">Nom de scène</span><input name="full_name" required maxLength={80} className="field py-2.5" /></label>
      <label className="block"><span className="label">Pays</span><input name="country" defaultValue="Sénégal" maxLength={60} className="field py-2.5" /></label>
      <label className="block sm:col-span-2"><span className="label">Biographie</span><textarea name="bio" rows={3} maxLength={5000} className="field py-2.5" /></label>
      <label className="block"><span className="label">Photo</span><input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-plum file:px-4 file:py-2 file:text-white" /></label>
      <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" name="featured" defaultChecked className="size-4 accent-[var(--color-plum)]" /> À la une sur l&apos;accueil</label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary min-h-10 disabled:opacity-60">{pending ? "Création…" : "Créer la fiche"}</button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-mute underline">Fermer</button>
        {state.message && <span className="text-sm text-plum" role="status">{state.message}</span>}
        {state.error && <span className="text-sm text-red-700" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
