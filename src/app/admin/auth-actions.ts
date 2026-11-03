"use server";

import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/server";
import { getAdmin } from "@/lib/admin";

export type LoginState = { error?: string };

// Limitation simple des tentatives (mémoire de l'instance) : 8 essais / 15 min par e-mail
const attempts = new Map<string, number[]>();
function tooMany(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < 15 * 60 * 1000);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > 8;
}

export async function loginAction(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Saisissez votre e-mail et votre mot de passe." };
  if (tooMany(email)) return { error: "Trop de tentatives. Patientez 15 minutes." };

  const supabase = await sessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  // message identique quelle que soit la cause : ne révèle pas si le compte existe
  if (error) return { error: "Identifiants incorrects." };
  if (!(await getAdmin())) {
    await supabase.auth.signOut();
    return { error: "Ce compte n'a pas accès à l'administration." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect("/admin/connexion");
}
