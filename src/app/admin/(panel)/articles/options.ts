import { requireAdmin } from "@/lib/admin";

/** Artistes proposés dans la liste « Artiste lié » des articles. */
export async function artistOptions() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("artists").select("id, profiles(full_name)");
  return ((data ?? []) as unknown as { id: string; profiles: { full_name: string } | null }[])
    .map((a) => ({ id: a.id, name: a.profiles?.full_name || "Sans nom" }))
    .sort((x, y) => x.name.localeCompare(y.name, "fr"));
}
