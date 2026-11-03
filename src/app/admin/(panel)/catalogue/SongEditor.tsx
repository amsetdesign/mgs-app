"use client";

import { useActionState } from "react";
import { updateSong, type AdminState } from "../../actions";

// mêmes listes que l'application (lib/catalog.ts)
const GENRES = ["Gospel", "Louange", "Adoration", "Afro Gospel", "Gospel Urbain", "Rap Chrétien", "Chorale", "RnB Gospel", "Acoustique"];
const PODCAST = ["Prédication", "Enseignement", "Témoignage", "Méditation", "Émission"];

export default function SongEditor({ id, title, genre, podcast = false }: { id: string; title: string; genre: string; podcast?: boolean }) {
  const list = podcast ? PODCAST : GENRES;
  const [state, action, pending] = useActionState<AdminState, FormData>(updateSong, {});
  return (
    <form action={action} className="grid gap-3 pt-3 sm:grid-cols-[1fr_180px_1fr]">
      <input type="hidden" name="id" value={id} />
      <label className="block"><span className="label">Titre</span><input name="title" defaultValue={title} required maxLength={160} className="field py-2.5" /></label>
      <label className="block">
        <span className="label">{podcast ? "Catégorie" : "Genre"}</span>
        <select name="genre" defaultValue={list.includes(genre) ? genre : list[0]} className="field py-2.5">
          {list.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </label>
      <label className="block"><span className="label">Nouvelle pochette</span><input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full pt-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-plum file:px-4 file:py-2 file:text-white" /></label>
      <div className="flex items-center gap-3 sm:col-span-3">
        <button type="submit" disabled={pending} className="btn-primary min-h-10 disabled:opacity-60">{pending ? "Enregistrement…" : "Enregistrer"}</button>
        {state.message && <span className="text-sm text-plum" role="status">{state.message}</span>}
        {state.error && <span className="text-sm text-red-700" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
