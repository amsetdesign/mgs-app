import { getAdmin } from "@/lib/admin";

// Export des inscrits (administrateurs uniquement)
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return new Response("Accès refusé", { status: 403 });
  const { data } = await admin.supabase.from("newsletter_subscribers").select("email, source, created_at").order("created_at");
  const rows = (data ?? []) as { email: string; source: string; created_at: string }[];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = ["email,source,date", ...rows.map((r) => [esc(r.email), esc(r.source), esc(r.created_at.slice(0, 10))].join(","))].join("\r\n");
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mgs-newsletter-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
