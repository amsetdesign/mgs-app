import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { PROJECT_TYPES, SUBMISSION_STATUS, type ProjectType, type SubmissionStatus } from "@/lib/labels";
import { PACKS } from "@/lib/site";
import { formatDate, formatPrice } from "@/lib/format";
import SubmissionEditor from "./SubmissionEditor";

type Submission = {
  id: string; artist_name: string; phone: string; email: string; country: string; socials: string;
  project_type: ProjectType; title: string; release_date: string | null; description: string;
  youtube_url: string; download_url: string; visual_url: string; pack: string; amount: number;
  status: SubmissionStatus; payment_ref: string; admin_note: string; created_at: string;
};

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  recu: "bg-amber-100 text-amber-900",
  paye: "bg-sky-100 text-sky-900",
  en_cours: "bg-violet-100 text-violet-900",
  publie: "bg-emerald-100 text-emerald-900",
  refuse: "bg-zinc-200 text-zinc-700",
};

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const { supabase } = await requireAdmin();
  const { statut } = await searchParams;
  const filter = statut && statut in SUBMISSION_STATUS ? (statut as SubmissionStatus) : null;
  let q = supabase.from("submissions").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter) q = q.eq("status", filter);
  const { data } = await q;
  const items = (data ?? []) as Submission[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Projets soumis</h1>
        <p className="mt-1 text-mute">Reçu, payé, en cours, publié : suivez chaque projet jusqu&apos;à sa diffusion.</p>
      </div>
      <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-2">
        <Link href="/admin/soumissions" className={`rounded-full px-4 py-2 text-sm ${!filter ? "bg-ink text-white" : "bg-white text-mute"}`}>Tous</Link>
        {(Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((s) => (
          <Link key={s} href={`/admin/soumissions?statut=${s}`} className={`rounded-full px-4 py-2 text-sm ${filter === s ? "bg-ink text-white" : "bg-white text-mute"}`}>{SUBMISSION_STATUS[s]}</Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucun projet {filter ? `au statut « ${SUBMISSION_STATUS[filter]} »` : "pour l'instant"}.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((s) => {
            const pack = PACKS.find((p) => p.id === s.pack);
            return (
              <li key={s.id} className="rounded-[var(--radius-card)] bg-white p-5">
                <div className="flex flex-wrap items-start gap-4">
                  {s.visual_url && (
                    <a href={s.visual_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.visual_url} alt="" className="size-24 rounded-xl object-cover" />
                    </a>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[s.status]}`}>{SUBMISSION_STATUS[s.status]}</span>
                      <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold">Pack {pack?.name ?? s.pack} · {formatPrice(s.amount)}</span>
                      <span className="text-xs text-mute">Reçu le {formatDate(s.created_at, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="mt-2 font-display text-xl font-bold">{s.title}</p>
                    <p className="text-mute">{PROJECT_TYPES[s.project_type]} de <strong className="text-ink">{s.artist_name}</strong> ({s.country}){s.release_date ? ` · sortie le ${formatDate(s.release_date)}` : ""}</p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <a href={`tel:${s.phone.replace(/[^+0-9]/g, "")}`} className="text-plum underline">{s.phone}</a>
                      <a href={`https://wa.me/${s.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-plum underline">WhatsApp</a>
                      <a href={`mailto:${s.email}`} className="text-plum underline">{s.email}</a>
                      {s.youtube_url && <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" className="text-plum underline">YouTube</a>}
                      {s.download_url && <a href={s.download_url} target="_blank" rel="noopener noreferrer" className="text-plum underline">Écoute / téléchargement</a>}
                    </p>
                  </div>
                </div>
                {(s.description || s.socials) && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer text-mute">Description et réseaux</summary>
                    {s.description && <p className="mt-2 whitespace-pre-line">{s.description}</p>}
                    {s.socials && <p className="mt-2 break-all whitespace-pre-line text-mute">{s.socials}</p>}
                  </details>
                )}
                <div className="mt-4 border-t border-line pt-4">
                  <SubmissionEditor id={s.id} status={s.status} paymentRef={s.payment_ref} note={s.admin_note} paid={s.amount > 0} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
