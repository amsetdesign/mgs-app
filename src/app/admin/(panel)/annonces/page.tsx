import { requireAdmin } from "@/lib/admin";
import { formatCount, formatDate, todayIso } from "@/lib/format";
import { audioAdAction, setAdsEvery } from "../../actions";
import AdForm from "./AdForm";

type Ad = { id: string; kind: "jingle" | "pub"; title: string; sponsor: string; audio_url: string; active: boolean; starts_at: string; ends_at: string | null; plays_count: number };

export default async function AdsPage() {
  const { supabase } = await requireAdmin();
  const [{ data, error }, { data: cfg }] = await Promise.all([
    supabase.from("audio_ads").select("*").order("created_at", { ascending: false }),
    supabase.from("app_config").select("value").eq("key", "ads_every").maybeSingle(),
  ]);
  const ads = (data ?? []) as Ad[];
  const every = Number(cfg?.value ?? 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Annonces audio</h1>
        <p className="mt-1 text-mute">
          Jingles MGS et publicités en voix off, diffusés dans l&apos;application entre deux titres de musique (jamais pendant un podcast). Les auditeurs ne peuvent pas les passer.
        </p>
      </div>
      {error ? (
        <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Indisponible. Vérifiez que le fichier SQL « MGS - 18 » a été exécuté.</p>
      ) : (
        <>
          <form action={setAdsEvery} className="flex flex-wrap items-end gap-3 rounded-[var(--radius-card)] bg-white p-5">
            <label className="block">
              <span className="label">Fréquence</span>
              <select name="every" defaultValue={String(every)} className="field py-2.5">
                <option value="0">Aucune annonce (désactivé)</option>
                {[2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n} value={n}>Une annonce tous les {n} titres</option>)}
              </select>
            </label>
            <button className="btn-primary min-h-10">Appliquer</button>
            <p className="text-sm text-mute">Les annonces actives sont diffusées à tour de rôle.</p>
          </form>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">Nouvelle annonce</h2>
            <AdForm today={todayIso()} />
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">Annonces ({ads.length})</h2>
            {ads.length === 0 ? (
              <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Aucune annonce. Commencez par un jingle « Vous écoutez Music Gospel Sénégal ».</p>
            ) : (
              <ul className="space-y-3">
                {ads.map((a) => (
                  <li key={a.id} className="rounded-[var(--radius-card)] bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.kind === "pub" ? "bg-plum text-white" : "bg-orchid/40 text-plum-700"}`}>{a.kind === "pub" ? "Publicité" : "Jingle"}</span>
                      <span className="font-medium">{a.title}</span>
                      {a.sponsor && <span className="text-sm text-mute">· {a.sponsor}</span>}
                      <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.active ? "bg-emerald-100 text-emerald-900" : "bg-zinc-200 text-zinc-700"}`}>{a.active ? "Active" : "En pause"}</span>
                    </div>
                    <p className="mt-1 text-sm text-mute">
                      {formatCount(a.plays_count)} diffusion{a.plays_count > 1 ? "s" : ""} · du {formatDate(a.starts_at, { day: "numeric", month: "short", year: "numeric" })}{a.ends_at ? ` au ${formatDate(a.ends_at, { day: "numeric", month: "short", year: "numeric" })}` : ", sans fin"}
                    </p>
                    <audio controls preload="none" src={a.audio_url} className="mt-3 w-full max-w-md" />
                    <div className="mt-3 flex gap-2">
                      <form action={audioAdAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="do" value={a.active ? "pause" : "activate"} />
                        <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-plum hover:text-plum">{a.active ? "Mettre en pause" : "Réactiver"}</button>
                      </form>
                      <form action={audioAdAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="do" value="delete" />
                        <button className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">Supprimer</button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
