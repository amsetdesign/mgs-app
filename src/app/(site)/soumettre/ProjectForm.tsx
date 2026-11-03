"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitProject, type FormState } from "../actions";
import { PROJECT_TYPES, type ProjectType } from "@/lib/labels";
import { PACKS, SITE, type PackId } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { Field, FormError, FormSuccess, Honeypot } from "@/components/FormBits";
import { IconCheck } from "@/components/icons";

export default function ProjectForm({ initialPack }: { initialPack: PackId }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitProject, { ok: false });
  const f = state.fields ?? {};
  const [pack, setPack] = useState<PackId>((f.pack as PackId) || initialPack);
  const chosen = PACKS.find((p) => p.id === pack)!;
  const pay = SITE.payment;

  if (state.ok) {
    const paid = PACKS.find((p) => p.id === state.fields?.pack);
    return (
      <FormSuccess title="Merci, votre projet est bien arrivé" message={state.message}>
        {paid && paid.price > 0 && (pay.wave || pay.orangeMoney) && (
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-paper p-5 text-left text-sm">
            <p className="font-semibold">Paiement du pack {paid.name} : {formatPrice(paid.price)}</p>
            {pay.wave && <p className="mt-2">Wave : {pay.wave}</p>}
            {pay.orangeMoney && <p className="mt-1">Orange Money : {pay.orangeMoney}</p>}
            {pay.holder && <p className="mt-1 text-mute">Au nom de {pay.holder}</p>}
            <p className="mt-3 text-mute">Indiquez le titre de votre projet dans le message du paiement. La diffusion démarre dès réception.</p>
          </div>
        )}
        <Link href="/" className="btn-primary mt-6">Retour à l&apos;accueil</Link>
      </FormSuccess>
    );
  }

  return (
    <form action={action} className="space-y-12" encType="multipart/form-data">
      <Honeypot />

      <fieldset>
        <legend className="font-display text-xl font-bold">1. Choisissez votre pack</legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PACKS.map((p) => {
            const active = p.id === pack;
            return (
              <label key={p.id} className={`relative flex cursor-pointer flex-col rounded-[var(--radius-card)] border-2 p-5 transition-colors ${active ? "border-plum bg-white" : "border-line bg-white/60 hover:border-plum/40"}`}>
                <input type="radio" name="pack" value={p.id} checked={active} onChange={() => setPack(p.id)} className="sr-only" />
                <span className="flex items-baseline justify-between gap-3 pr-6">
                  <span className="font-display text-lg font-bold">{p.name}</span>
                  <span className="font-display text-lg font-bold text-plum">{formatPrice(p.price)}</span>
                </span>
                <span className="mt-1 text-sm text-mute">{p.summary}</span>
                {active && <IconCheck className="absolute top-3 right-3 size-5 text-plum" />}
              </label>
            );
          })}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute">
          {chosen.features.map((feat) => <li key={feat} className="flex items-center gap-1.5"><IconCheck className="size-4 text-plum" />{feat}</li>)}
        </ul>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-xl font-bold">2. L&apos;artiste</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom d'artiste ou de groupe" required>
            <input name="artist_name" required maxLength={120} defaultValue={f.artist_name} className="field" />
          </Field>
          <Field label="Pays" required>
            <input name="country" required maxLength={60} defaultValue={f.country || "Sénégal"} className="field" />
          </Field>
          <Field label="Téléphone (WhatsApp de préférence)" required>
            <input name="phone" type="tel" required maxLength={40} defaultValue={f.phone} className="field" placeholder="+221 …" />
          </Field>
          <Field label="E-mail" required>
            <input name="email" type="email" required maxLength={160} defaultValue={f.email} className="field" autoComplete="email" />
          </Field>
        </div>
        <Field label="Réseaux sociaux" hint="Liens Facebook, Instagram, TikTok, YouTube… un par ligne.">
          <textarea name="socials" rows={3} maxLength={500} defaultValue={f.socials} className="field" />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-xl font-bold">3. Le projet</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Type de projet" required>
            <select name="project_type" defaultValue={f.project_type || "single"} className="field">
              {(Object.keys(PROJECT_TYPES) as ProjectType[]).map((t) => <option key={t} value={t}>{PROJECT_TYPES[t]}</option>)}
            </select>
          </Field>
          <Field label="Date de sortie">
            <input name="release_date" type="date" defaultValue={f.release_date} className="field" />
          </Field>
        </div>
        <Field label="Titre du projet" required>
          <input name="title" required maxLength={160} defaultValue={f.title} className="field" />
        </Field>
        <Field label="Description" hint="Le message du projet, les featurings, ce que vous voulez mettre en avant.">
          <textarea name="description" rows={5} maxLength={4000} defaultValue={f.description} className="field" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Lien YouTube">
            <input name="youtube_url" type="url" maxLength={500} defaultValue={f.youtube_url} className="field" placeholder="https://youtu.be/…" />
          </Field>
          <Field label="Lien d'écoute ou de téléchargement">
            <input name="download_url" type="url" maxLength={500} defaultValue={f.download_url} className="field" placeholder="https://…" />
          </Field>
        </div>
        <Field label="Visuel du projet" hint="Pochette ou affiche. JPG, PNG ou WEBP, 5 Mo maximum.">
          <input name="visual" type="file" accept="image/jpeg,image/png,image/webp" className="field file:mr-4 file:rounded-full file:border-0 file:bg-plum file:px-4 file:py-2 file:text-sm file:text-white" />
        </Field>
      </fieldset>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-0.5 size-5 accent-[var(--color-plum)]" required />
        <span>Je confirme détenir les droits sur ce projet (composition, enregistrement, visuel) et j&apos;accepte les <Link href="/conditions" className="text-plum underline">conditions d&apos;utilisation</Link>.</span>
      </label>

      <FormError error={state.error} />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
          {pending ? "Envoi…" : chosen.price > 0 ? `Envoyer avec le pack ${chosen.name}` : "Envoyer mon projet"}
        </button>
        <p className="text-sm text-mute">{chosen.price > 0 ? "Le paiement se fait par Wave ou Orange Money, après validation de votre projet." : "Aucun paiement demandé."}</p>
      </div>
    </form>
  );
}
