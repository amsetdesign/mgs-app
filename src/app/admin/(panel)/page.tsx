import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatCount, formatDate, formatPrice } from "@/lib/format";

type Stats = {
  users: number; users_7d: number; artists: number; songs_published: number; songs_pending: number;
  streams_total: number; streams_7d: number; listeners_7d: number;
  events_pending: number; events_upcoming: number; submissions_new: number; submissions_paid_amount: number;
  messages_new: number; newsletter: number; articles_published: number;
  streams_by_day: { day: string; plays: number }[];
};

function Tile({ label, value, sub, href }: { label: string; value: string; sub?: string; href?: string }) {
  const body = (
    <>
      <p className="text-sm text-mute">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-mute">{sub}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="rounded-[var(--radius-card)] bg-white p-5 transition-shadow hover:shadow-[0_10px_30px_-18px_rgb(12_9_15/0.4)]">{body}</Link>
  ) : (
    <div className="rounded-[var(--radius-card)] bg-white p-5">{body}</div>
  );
}

/** Écoutes par jour sur 30 jours : barres d'une seule teinte, valeur au survol et tableau lisible. */
function StreamsChart({ data }: { data: Stats["streams_by_day"] }) {
  const max = Math.max(1, ...data.map((d) => d.plays));
  const W = 720, H = 180, gap = 2;
  const bw = (W - gap * (data.length - 1)) / data.length;
  const total = data.reduce((a, d) => a + d.plays, 0);
  return (
    <figure className="rounded-[var(--radius-card)] bg-white p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-lg font-bold">Écoutes sur 30 jours</span>
        <span className="text-sm text-mute">{formatCount(total)} écoutes de 30 s ou plus</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H + 22}`} className="mt-4 w-full" role="img" aria-label={`Écoutes par jour sur 30 jours, total ${total}`}>
        <line x1="0" x2={W} y1={H} y2={H} stroke="#e8e1ec" />
        {data.map((d, i) => {
          const h = (d.plays / max) * (H - 8);
          const x = i * (bw + gap);
          return (
            <g key={d.day}>
              <rect x={x} y={0} width={bw} height={H} fill="transparent">
                <title>{`${formatDate(d.day, { day: "numeric", month: "long" })} : ${d.plays} écoute${d.plays > 1 ? "s" : ""}`}</title>
              </rect>
              {d.plays > 0 && <rect x={x} y={H - h} width={bw} height={h} rx={Math.min(4, bw / 2)} fill="#800080" pointerEvents="none" />}
            </g>
          );
        })}
        <text x="0" y={H + 16} fontSize="11" fill="#6d6474">{formatDate(data[0]?.day, { day: "numeric", month: "short" })}</text>
        <text x={W} y={H + 16} fontSize="11" fill="#6d6474" textAnchor="end">Aujourd&apos;hui</text>
      </svg>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-mute">Voir les chiffres</summary>
        <table className="mt-2 w-full text-left">
          <thead><tr className="text-mute"><th className="py-1 font-medium">Jour</th><th className="py-1 font-medium">Écoutes</th></tr></thead>
          <tbody>
            {[...data].reverse().map((d) => (
              <tr key={d.day} className="border-t border-line"><td className="py-1">{formatDate(d.day, { weekday: "short", day: "numeric", month: "short" })}</td><td className="py-1 tabular-nums">{d.plays}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export default async function DashboardPage() {
  const { supabase, name } = await requireAdmin();
  const { data, error } = await supabase.rpc("admin_stats");
  if (error || !data) {
    return (
      <div className="max-w-xl rounded-[var(--radius-card)] bg-white p-6">
        <h1 className="font-display text-2xl font-bold">Tableau de bord</h1>
        <p className="mt-3 text-mute">Les statistiques ne sont pas disponibles. Vérifiez que le fichier SQL « MGS - 6 site officiel » a bien été exécuté dans Supabase.</p>
      </div>
    );
  }
  const s = data as Stats;
  const todo = [
    { n: s.submissions_new, label: "projet(s) soumis à traiter", href: "/admin/soumissions" },
    { n: s.events_pending, label: "événement(s) à valider", href: "/admin/evenements" },
    { n: s.songs_pending, label: "titre(s) à écouter et valider", href: "/admin/titres" },
    { n: s.messages_new, label: "message(s) non traité(s)", href: "/admin/messages" },
  ].filter((t) => t.n > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Bonjour{name ? ` ${name.split(" ")[0]}` : ""}</h1>
        <p className="mt-1 text-mute">L&apos;activité de l&apos;application et du site, en temps réel.</p>
      </div>

      <section aria-label="À faire" className="rounded-[var(--radius-card)] bg-ink p-5 text-white">
        <p className="font-display text-lg font-bold">À faire</p>
        {todo.length > 0 ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {todo.map((t) => (
              <li key={t.href}><Link href={t.href} className="flex items-center gap-3 rounded-xl bg-night px-4 py-3 hover:bg-night-2"><span className="font-display text-2xl font-bold text-orchid tabular-nums">{t.n}</span>{t.label}</Link></li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-haze">Rien en attente. Tout est à jour.</p>
        )}
      </section>

      <section aria-label="Application" className="space-y-3">
        <h2 className="font-display text-xl font-bold">Application</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile label="Comptes" value={formatCount(s.users)} sub={`+${s.users_7d} cette semaine`} />
          <Tile label="Auditeurs actifs (7 j)" value={formatCount(s.listeners_7d)} />
          <Tile label="Écoutes (7 j)" value={formatCount(s.streams_7d)} sub={`${formatCount(s.streams_total)} au total`} />
          <Tile label="Titres publiés" value={formatCount(s.songs_published)} sub={`${s.artists} artistes`} href="/admin/artistes" />
        </div>
        <StreamsChart data={s.streams_by_day} />
      </section>

      <section aria-label="Site" className="space-y-3">
        <h2 className="font-display text-xl font-bold">Site et promotion</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile label="Packs encaissés" value={formatPrice(s.submissions_paid_amount)} href="/admin/soumissions" />
          <Tile label="Événements à venir" value={String(s.events_upcoming)} href="/admin/evenements" />
          <Tile label="Articles publiés" value={String(s.articles_published)} href="/admin/articles" />
          <Tile label="Inscrits newsletter" value={formatCount(s.newsletter)} href="/admin/newsletter" />
        </div>
      </section>
    </div>
  );
}
