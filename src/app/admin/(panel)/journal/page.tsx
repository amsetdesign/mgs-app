import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";

// Libellés lisibles des actions enregistrées par l'administration et par la base
const ACTIONS: Record<string, string> = {
  projet_statut: "Statut d'un projet soumis",
  evenement_publie: "Événement publié",
  evenement_refuse: "Événement refusé",
  evenement_retire: "Événement retiré",
  article_cree: "Article créé",
  article_modifie: "Article modifié",
  article_supprime: "Article supprimé",
  artiste_cree: "Fiche artiste créée",
  artiste_modifie: "Fiche artiste modifiée",
  artiste_rattache: "Fiche rattachée à un compte",
  titre_publie: "Titre publié",
  titre_refuse: "Titre refusé",
  titre_modifie: "Titre modifié",
  titre_depublie: "Titre dépublié",
  titre_supprime: "Titre supprimé",
  selection_ajout: "Ajout à la Sélection MGS",
  selection_retrait: "Retrait de la Sélection MGS",
  role_change: "Rôle modifié",
  compte_suspendu: "Compte suspendu",
  compte_retabli: "Compte rétabli",
  mise_en_avant_creee: "Mise en avant programmée",
  mise_en_avant_pause: "Mise en avant en pause",
  mise_en_avant_activate: "Mise en avant réactivée",
  mise_en_avant_delete: "Mise en avant supprimée",
  signalement_titre_depublie: "Signalement : titre dépublié",
  signalement_ecarte: "Signalement écarté",
  signalement_traite: "Signalement traité",
  annonce_creee: "Annonce audio ajoutée",
  annonce_pause: "Annonce audio en pause",
  annonce_activate: "Annonce audio réactivée",
  annonce_delete: "Annonce audio supprimée",
  annonces_frequence: "Fréquence des annonces modifiée",
};

const ROLES: Record<string, string> = { listener: "auditeur", artist: "artiste", curator: "curateur", admin: "administrateur" };

type Entry = { id: number; action: string; target_type: string; target_id: string; summary: string; created_at: string; profiles: { full_name: string } | null };
const PAGE = 100;

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { supabase } = await requireAdmin();
  const current = Math.max(1, Number((await searchParams).page) || 1);
  const { data, error, count } = await supabase
    .from("admin_log")
    .select("id, action, target_type, target_id, summary, created_at, profiles(full_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((current - 1) * PAGE, current * PAGE - 1);
  const entries = (data ?? []) as unknown as Entry[];
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Journal</h1>
        <p className="mt-1 text-mute">Qui a fait quoi dans l&apos;administration. Le journal ne peut être ni modifié ni effacé.</p>
      </div>
      {error ? (
        <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Indisponible. Vérifiez que le fichier SQL « MGS - 9 » a été exécuté.</p>
      ) : entries.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucune action enregistrée pour l&apos;instant.</p>
      ) : (
        <>
          <ol className="divide-y divide-line rounded-[var(--radius-card)] bg-white">
            {entries.map((e) => (
              <li key={e.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <span className="w-36 shrink-0 text-mute tabular-nums">{formatDate(e.created_at, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                <span className="w-40 shrink-0 truncate font-medium">{e.profiles?.full_name || "Équipe"}</span>
                <span className="min-w-0 flex-1">
                  {ACTIONS[e.action] ?? e.action}
                  {e.summary && <span className="text-mute"> · {e.action === "role_change" ? ROLES[e.summary] ?? e.summary : e.summary}</span>}
                </span>
              </li>
            ))}
          </ol>
          {pages > 1 && (
            <nav aria-label="Pages" className="flex items-center gap-3 text-sm">
              {current > 1 && <Link href={`/admin/journal?page=${current - 1}`} className="underline">Plus récent</Link>}
              <span className="text-mute">Page {current} / {pages}</span>
              {current < pages && <Link href={`/admin/journal?page=${current + 1}`} className="underline">Plus ancien</Link>}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
