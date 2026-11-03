"use client";

import { useActionState, useState } from "react";
import { savePromotion, type AdminState } from "../../actions";

type Opt = { id: string; label: string };
const KINDS = { banner: "Bannière (image + lien)", song: "Un titre", artist: "Un artiste", event: "Un événement" } as const;
type Kind = keyof typeof KINDS;

export default function PromotionForm({ songs, artists, events, submissions, today }: { songs: Opt[]; artists: Opt[]; events: Opt[]; submissions: Opt[]; today: string }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(savePromotion, {});
  const [kind, setKind] = useState<Kind>("banner");
  const targets = kind === "song" ? songs : kind === "artist" ? artists : kind === "event" ? events : [];
  return (
    <form action={action} className="grid gap-4 rounded-[var(--radius-card)] bg-white p-5 sm:grid-cols-2">
      <label className="block">
        <span className="label">Type</span>
        <select name="kind" value={kind} onChange={(e) => setKind(e.target.value as Kind)} className="field py-2.5">
          {(Object.keys(KINDS) as Kind[]).map((k) => <option key={k} value={k}>{KINDS[k]}</option>)}
        </select>
      </label>
      {kind !== "banner" ? (
        <label className="block">
          <span className="label">{kind === "song" ? "Titre" : kind === "artist" ? "Artiste" : "Événement"}</span>
          <select name="target" required className="field py-2.5" defaultValue="">
            <option value="" disabled>Choisir…</option>
            {targets.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </label>
      ) : (
        <label className="block"><span className="label">Lien (page du site ou adresse https://)</span><input name="link_url" maxLength={500} className="field py-2.5" placeholder="/evenements/… ou https://…" /></label>
      )}
      <label className="block"><span className="label">Accroche</span><input name="title" required maxLength={120} className="field py-2.5" placeholder="Ex. : Nouveau single disponible" /></label>
      <label className="block"><span className="label">Texte court (facultatif)</span><input name="subtitle" maxLength={240} className="field py-2.5" /></label>
      <label className="block"><span className="label">Image {kind === "banner" ? "(obligatoire)" : "(facultatif, sinon celle du titre ou de l'artiste)"}</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full pt-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-plum file:px-4 file:py-2 file:text-white" /></label>
      <label className="block">
        <span className="label">Où l&apos;afficher</span>
        <select name="placement" defaultValue="both" className="field py-2.5">
          <option value="both">Site et application</option>
          <option value="site">Site seulement</option>
          <option value="app">Application seulement</option>
        </select>
      </label>
      <label className="block"><span className="label">Début</span><input name="starts" type="date" required defaultValue={today} className="field py-2.5" /></label>
      <label className="block"><span className="label">Fin</span><input name="ends" type="date" required min={today} className="field py-2.5" /></label>
      <label className="block">
        <span className="label">Pack payé correspondant (facultatif)</span>
        <select name="submission_id" defaultValue="" className="field py-2.5">
          <option value="">Aucun</option>
          {submissions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" name="sponsored" defaultChecked className="size-4 accent-[var(--color-plum)]" /> Afficher la mention « Sponsorisé »</label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary min-h-10 disabled:opacity-60">{pending ? "Enregistrement…" : "Programmer"}</button>
        {state.message && <span className="text-sm text-plum" role="status">{state.message}</span>}
        {state.error && <span className="text-sm text-red-700" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
