import { requireAdmin } from "@/lib/admin";
import ArtistEditor, { type ArtistRow } from "./ArtistEditor";

export default async function AdminArtistsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { supabase } = await requireAdmin();
  const { q } = await searchParams;
  const { data } = await supabase
    .from("artists")
    .select("id, user_id, slug, bio, verified, featured, social_facebook, social_instagram, social_tiktok, social_youtube, profiles(full_name, avatar_url, country)")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  let artists = (data ?? []) as unknown as ArtistRow[];
  const term = (q ?? "").trim().toLowerCase();
  if (term) artists = artists.filter((a) => a.profiles?.full_name?.toLowerCase().includes(term));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Artistes</h1>
        <p className="mt-1 text-mute">Complétez les fiches : photo, biographie, réseaux. Elles deviennent la page officielle de l&apos;artiste sur Google, et sont aussi visibles dans l&apos;application.</p>
      </div>
      <form className="flex max-w-md gap-2">
        <input name="q" defaultValue={q} placeholder="Rechercher un artiste" className="field py-2.5" aria-label="Rechercher un artiste" />
        <button className="btn-primary min-h-10">Chercher</button>
      </form>
      {artists.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucun artiste.</p>
      ) : (
        <ul className="space-y-4">
          {artists.map((a) => (
            <li key={a.id} className="rounded-[var(--radius-card)] bg-white p-5"><ArtistEditor artist={a} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
