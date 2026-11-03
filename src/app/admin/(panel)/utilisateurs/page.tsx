import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { setUserRole, setUserSuspended } from "../../actions";

type U = {
  id: string; email: string; full_name: string; avatar_url: string; role: "listener" | "artist" | "curator" | "admin";
  suspended: boolean; created_at: string; last_sign_in_at: string | null; artist_slug: string | null; technical: boolean; total: number;
};

const ROLES = { listener: "Auditeur", artist: "Artiste", curator: "Curateur", admin: "Administrateur" } as const;
const PAGE = 50;

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; page?: string }> }) {
  const { supabase, userId } = await requireAdmin();
  const { q = "", role = "", page = "1" } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const { data, error } = await supabase.rpc("admin_list_users", { p_search: q.trim(), p_role: role in ROLES ? role : "", p_limit: PAGE, p_offset: (current - 1) * PAGE });
  const users = (data ?? []) as U[];
  const total = users[0]?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const href = (p: number) => `/admin/utilisateurs?${new URLSearchParams({ ...(q ? { q } : {}), ...(role ? { role } : {}), page: String(p) })}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="mt-1 text-mute">Les comptes de l&apos;application. Changez un rôle ou suspendez un compte en cas d&apos;abus.</p>
      </div>
      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Nom ou e-mail" aria-label="Rechercher" className="field max-w-xs py-2" />
        <select name="role" defaultValue={role} aria-label="Rôle" className="field max-w-48 py-2">
          <option value="">Tous les rôles</option>
          {(Object.keys(ROLES) as (keyof typeof ROLES)[]).map((r) => <option key={r} value={r}>{ROLES[r]}</option>)}
        </select>
        <button className="btn-primary min-h-10">Filtrer</button>
      </form>

      {error ? (
        <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Liste indisponible. Vérifiez que le fichier SQL « MGS - 8 » a été exécuté.</p>
      ) : users.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucun compte.</p>
      ) : (
        <>
          <p className="text-sm text-mute">{total} compte{total > 1 ? "s" : ""}</p>
          <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white">
            {users.map((u) => (
              <li key={u.id} className={`flex flex-wrap items-center gap-4 px-4 py-4 sm:px-5 ${u.suspended ? "bg-red-50/60" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {u.avatar_url ? <img src={u.avatar_url} alt="" className="size-11 rounded-full object-cover" /> : <div className="flex size-11 items-center justify-center rounded-full bg-plum font-display font-bold text-white">{(u.full_name || u.email).slice(0, 1).toUpperCase()}</div>}
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {u.full_name || "Sans nom"}
                    {u.suspended && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">Suspendu</span>}
                    {u.technical && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">Fiche créée par l&apos;équipe</span>}
                    {u.artist_slug && <Link href={`/artistes/${u.artist_slug}`} target="_blank" className="text-xs text-plum underline">page artiste</Link>}
                  </p>
                  <p className="truncate text-sm text-mute">
                    {u.technical ? "Pas encore de compte personnel" : u.email} · inscrit le {formatDate(u.created_at, { day: "numeric", month: "short", year: "numeric" })}
                    {u.last_sign_in_at ? ` · vu le ${formatDate(u.last_sign_in_at, { day: "numeric", month: "short" })}` : ""}
                  </p>
                </div>
                {!u.technical && u.id !== userId && (
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={setUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <select name="role" defaultValue={u.role} aria-label={`Rôle de ${u.full_name || u.email}`} className="field py-1.5 text-sm">
                        {(Object.keys(ROLES) as (keyof typeof ROLES)[]).map((r) => <option key={r} value={r}>{ROLES[r]}</option>)}
                      </select>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-plum hover:text-plum">Appliquer</button>
                    </form>
                    <form action={setUserSuspended}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="suspended" value={u.suspended ? "false" : "true"} />
                      <button className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${u.suspended ? "border-line hover:border-plum" : "border-red-300 text-red-700 hover:bg-red-50"}`}>
                        {u.suspended ? "Rétablir" : "Suspendre"}
                      </button>
                    </form>
                  </div>
                )}
                {u.id === userId && <span className="text-xs text-mute">Vous</span>}
              </li>
            ))}
          </ul>
          {pages > 1 && (
            <nav aria-label="Pages" className="flex items-center gap-3 text-sm">
              {current > 1 && <Link href={href(current - 1)} className="underline">Précédent</Link>}
              <span className="text-mute">Page {current} / {pages}</span>
              {current < pages && <Link href={href(current + 1)} className="underline">Suivant</Link>}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
