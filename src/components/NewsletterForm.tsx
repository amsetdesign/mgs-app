"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type FormState } from "@/app/(site)/actions";

export default function NewsletterForm({ source = "site", dark = true }: { source?: string; dark?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, { ok: false });
  if (state.ok) return <p className={`text-sm ${dark ? "text-orchid" : "text-plum"}`} role="status">{state.message}</p>;
  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row" noValidate>
      <input type="hidden" name="source" value={source} />
      {/* champ piège pour les robots, invisible pour les visiteurs */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label htmlFor={`nl-${source}`} className="sr-only">Votre adresse e-mail</label>
      <input
        id={`nl-${source}`}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Votre adresse e-mail"
        className={`min-h-11 flex-1 rounded-full px-5 text-[15px] outline-none ${dark ? "border border-white/15 bg-white/5 text-white placeholder:text-haze focus:border-orchid" : "border border-line bg-white focus:border-plum"}`}
      />
      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Inscription…" : "S'inscrire"}</button>
      {state.error && <p className="text-sm text-red-400 sm:basis-full" role="alert">{state.error}</p>}
    </form>
  );
}
