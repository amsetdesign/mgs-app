import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Trace une action de l'équipe dans le journal (sans bloquer l'action si l'écriture échoue). */
export async function logAction(supabase: SupabaseClient, actorId: string, action: string, targetType = "", targetId = "", summary = "") {
  await supabase
    .from("admin_log")
    .insert({ actor_id: actorId, action, target_type: targetType, target_id: targetId, summary: summary.slice(0, 300) })
    .then(() => undefined, () => undefined);
}
