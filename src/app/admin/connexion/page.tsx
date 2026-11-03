"use client";

import { useActionState } from "react";
import Image from "next/image";
import logoWhite from "../../../../public/brand/logo-white.png";
import { loginAction, type LoginState } from "../auth-actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-sm">
        <Image src={logoWhite} alt="Music Gospel Sénégal" className="mx-auto h-12 w-auto" priority />
        <h1 className="mt-8 text-center font-display text-2xl font-bold text-white">Administration</h1>
        <p className="mt-2 text-center text-sm text-haze">Connectez-vous avec votre compte MGS (le même que dans l&apos;application).</p>
        <form action={action} className="mt-8 space-y-4 rounded-[var(--radius-card)] bg-white p-6">
          <label className="block">
            <span className="label">E-mail</span>
            <input name="email" type="email" required autoComplete="email" className="field" />
          </label>
          <label className="block">
            <span className="label">Mot de passe</span>
            <input name="password" type="password" required autoComplete="current-password" className="field" />
          </label>
          {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Connexion…" : "Se connecter"}</button>
        </form>
      </div>
    </main>
  );
}
