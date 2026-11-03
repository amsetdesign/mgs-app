import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";

export default async function NewsletterPage() {
  const { supabase } = await requireAdmin();
  const { data, count } = await supabase.from("newsletter_subscribers").select("email, source, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(500);
  const rows = (data ?? []) as { email: string; source: string; created_at: string }[];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Newsletter</h1>
          <p className="mt-1 text-mute">{count ?? rows.length} inscrit{(count ?? 0) > 1 ? "s" : ""}. Exportez la liste pour l&apos;importer dans votre outil d&apos;envoi.</p>
        </div>
        <a href="/admin/newsletter/export" className="btn-primary">Télécharger (CSV)</a>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucun inscrit pour l&apos;instant.</p>
      ) : (
        <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white">
          {rows.map((r) => (
            <li key={r.email} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
              <span className="min-w-0 flex-1 truncate">{r.email}</span>
              <span className="text-mute">{r.source}</span>
              <span className="w-28 text-right text-mute tabular-nums">{formatDate(r.created_at, { day: "numeric", month: "short", year: "numeric" })}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
