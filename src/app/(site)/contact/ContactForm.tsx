"use client";

import { useActionState } from "react";
import { sendContact, type FormState } from "../actions";
import { Field, FormError, FormSuccess, Honeypot } from "@/components/FormBits";

const SUBJECTS = { contact: "Question générale", partenariat: "Partenariat ou sponsoring", presse: "Presse", autre: "Autre" } as const;

export default function ContactForm({ subject }: { subject: keyof typeof SUBJECTS }) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendContact, { ok: false });
  if (state.ok) return <FormSuccess title="Message envoyé" message={state.message} />;
  return (
    <form action={action} className="space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" required><input name="name" required maxLength={120} className="field" autoComplete="name" /></Field>
        <Field label="E-mail" required><input name="email" type="email" required maxLength={160} className="field" autoComplete="email" /></Field>
        <Field label="Téléphone"><input name="phone" type="tel" maxLength={40} className="field" autoComplete="tel" /></Field>
        <Field label="Sujet">
          <select name="subject" defaultValue={subject} className="field">
            {(Object.keys(SUBJECTS) as (keyof typeof SUBJECTS)[]).map((s) => <option key={s} value={s}>{SUBJECTS[s]}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Message" required><textarea name="message" required rows={6} maxLength={4000} className="field" /></Field>
      <FormError error={state.error} />
      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Envoi…" : "Envoyer le message"}</button>
    </form>
  );
}
