"use client";

import { useActionState } from "react";
import { saveAudioAd, type AdminState } from "../../actions";

export default function AdForm({ today }: { today: string }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveAudioAd, {});
  return (
    <form action={action} className="grid gap-4 rounded-[var(--radius-card)] bg-white p-5 sm:grid-cols-2">
      <label className="block">
        <span className="label">Type</span>
        <select name="kind" defaultValue="jingle" className="field py-2.5">
          <option value="jingle">Jingle MGS (« Vous écoutez Music Gospel Sénégal… »)</option>
          <option value="pub">Publicité d&apos;un annonceur</option>
        </select>
      </label>
      <label className="block"><span className="label">Nom de l&apos;annonce</span><input name="title" required maxLength={120} className="field py-2.5" placeholder="Ex. : Jingle MGS 1" /></label>
      <label className="block"><span className="label">Annonceur (facultatif)</span><input name="sponsor" maxLength={120} className="field py-2.5" placeholder="Ex. : J Nation Prod" /></label>
      <label className="block"><span className="label">Lien (facultatif)</span><input name="link_url" maxLength={500} className="field py-2.5" placeholder="https://…" /></label>
      <label className="block"><span className="label">Début</span><input name="starts" type="date" defaultValue={today} className="field py-2.5" /></label>
      <label className="block"><span className="label">Fin (vide = sans fin)</span><input name="ends" type="date" min={today} className="field py-2.5" /></label>
      <label className="block sm:col-span-2">
        <span className="label">Fichier audio (MP3 ou M4A, 8 Mo maximum)</span>
        <input name="audio" type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a,.mp3,.m4a" required className="block w-full pt-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-plum file:px-4 file:py-2 file:text-white" />
        <span className="mt-1 block text-xs text-mute">Conseil : 10 à 30 secondes, voix claire, volume proche de celui des titres.</span>
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary min-h-10 disabled:opacity-60">{pending ? "Envoi…" : "Enregistrer l'annonce"}</button>
        {state.message && <span className="text-sm text-plum" role="status">{state.message}</span>}
        {state.error && <span className="text-sm text-red-700" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
