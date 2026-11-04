"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { eventsOnDay, submitEvent, type FormState } from "../../actions";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/labels";
import { Field, FormError, FormSuccess, Honeypot } from "@/components/FormBits";

type Clash = { title: string; city: string; organizer: string; starts_at: string };

export default function EventForm({ initialDate = "" }: { initialDate?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitEvent, { ok: false });
  const [clashes, setClashes] = useState<Clash[] | null>(null);
  const [checking, startCheck] = useTransition();
  const f = state.fields ?? {};
  const today = new Date().toISOString().slice(0, 10);

  const checkDate = (day: string) => {
    if (!day) return setClashes(null);
    startCheck(async () => setClashes(await eventsOnDay(day)));
  };

  // date choisie dans le calendrier annuel : vérifiée dès l'ouverture
  useEffect(() => {
    if (!initialDate) return;
    startCheck(async () => {
      const found = await eventsOnDay(initialDate);
      setClashes(found);
    });
  }, [initialDate]);

  if (state.ok) {
    return (
      <FormSuccess title="Merci, événement reçu" message={state.message}>
        <Link href="/evenements" className="btn-primary mt-6">Voir le calendrier</Link>
      </FormSuccess>
    );
  }

  return (
    <form action={action} className="space-y-10" encType="multipart/form-data">
      <Honeypot />
      <fieldset className="space-y-5">
        <legend className="font-display text-xl font-bold">L&apos;événement</legend>
        <Field label="Nom de l'événement" required>
          <input name="title" required maxLength={140} defaultValue={f.title} className="field" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Catégorie" required>
            <select name="category" defaultValue={f.category || "concert"} className="field">
              {(Object.keys(EVENT_CATEGORIES) as EventCategory[]).map((c) => <option key={c} value={c}>{EVENT_CATEGORIES[c]}</option>)}
            </select>
          </Field>
          <Field label="Organisateur" required>
            <input name="organizer" required maxLength={120} defaultValue={f.organizer} className="field" placeholder="Église, association, artiste…" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date" required>
            <input name="date" type="date" required min={today} defaultValue={f.date || initialDate} className="field" onChange={(e) => checkDate(e.target.value)} />
          </Field>
          <Field label="Heure de début" required>
            <input name="time" type="time" required defaultValue={f.time || "18:00"} className="field" />
          </Field>
        </div>
        <div aria-live="polite">
          {checking && <p className="text-sm text-mute">Vérification du calendrier…</p>}
          {!checking && clashes && clashes.length === 0 && <p className="text-sm text-plum">Aucun autre événement annoncé ce jour-là.</p>}
          {!checking && clashes && clashes.length > 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Attention : {clashes.length === 1 ? "un événement est déjà annoncé" : `${clashes.length} événements sont déjà annoncés`} ce jour-là.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {clashes.map((c) => <li key={`${c.title}-${c.starts_at}`}>{c.title}, {c.city} ({c.organizer})</li>)}
              </ul>
              <p className="mt-2">Pour que le public puisse aller à chaque événement, nous vous conseillons de choisir une autre date (<Link href="/evenements#calendrier" className="underline">voir les dates libres</Link>).</p>
              <label className="mt-3 flex items-start gap-2 font-medium">
                <input type="checkbox" name="maintain" className="mt-0.5 size-4 accent-[var(--color-plum)]" />
                Je maintiens cette date malgré l&apos;événement déjà prévu.
              </label>
            </div>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Ville" required>
            <input name="city" required maxLength={80} defaultValue={f.city} className="field" placeholder="Dakar" />
          </Field>
          <Field label="Lieu">
            <input name="venue" maxLength={160} defaultValue={f.venue} className="field" placeholder="Salle, église, adresse" />
          </Field>
          <Field label="Pays">
            <input name="country" maxLength={60} defaultValue={f.country || "Sénégal"} className="field" />
          </Field>
        </div>
        <Field label="Description" hint="Programme, artistes invités, informations pratiques.">
          <textarea name="description" rows={5} maxLength={4000} defaultValue={f.description} className="field" />
        </Field>
        <Field label="Affiche" hint="JPG, PNG ou WEBP, 5 Mo maximum.">
          <input name="poster" type="file" accept="image/jpeg,image/png,image/webp" className="field file:mr-4 file:rounded-full file:border-0 file:bg-plum file:px-4 file:py-2 file:text-sm file:text-white" />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-xl font-bold">Contact et billetterie</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Téléphone de contact">
            <input name="contact_phone" type="tel" maxLength={40} defaultValue={f.contact_phone} className="field" placeholder="+221 …" />
          </Field>
          <Field label="E-mail de contact">
            <input name="contact_email" type="email" maxLength={160} defaultValue={f.contact_email} className="field" />
          </Field>
        </div>
        <Field label="Lien de billetterie" hint="Facultatif. Adresse complète commençant par https://">
          <input name="ticket_url" type="url" maxLength={500} defaultValue={f.ticket_url} className="field" />
        </Field>
      </fieldset>

      <FormError error={state.error} />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Envoi…" : "Envoyer l'événement"}</button>
        <p className="text-sm text-mute">L&apos;équipe MGS vérifie chaque annonce avant publication.</p>
      </div>
    </form>
  );
}
