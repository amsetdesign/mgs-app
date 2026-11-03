import "server-only";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

/** Administrateur = compte connecté dont le profil a le rôle admin (même règle que la base : is_admin()). */
export async function getAdmin() {
  if (!hasSupabase) return null;
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;
  if (!uid) return null;
  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", uid).maybeSingle();
  if (profile?.role !== "admin") return null;
  return { supabase, userId: uid, email: (data.claims.email as string | undefined) ?? "", name: profile.full_name as string };
}

/** Garde des pages et actions de l'administration. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/connexion");
  return admin;
}
