import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/labels";
import { formatDate, formatTime, hoursAgoIso } from "@/lib/format";
import { deleteEvent, reviewEvent } from "../../actions";

type Ev = {
  id: string; slug: string; title: string; organizer: string; category: EventCategory; city: string; venue: string;
  starts_at: string; description: string; poster_url: string; contact_phone: string; contact_email: string;
  ticket_url: string; status: "pending" | "approved" | "rejected"; review_note: string; created_at: string;
};

export default async function AdminEventsPage() {
  const { supabase } = await requireAdmin();
  const since = hoursAgoIso(24);
  const [{ data: pending }, { data: upcoming }] = await Promise.all([
    supabase.from("events").select("*").eq("status", "pending").order("starts_at"),
    supabase.from("events").select("*").eq("status", "approved").gte("starts_at", since).order("starts_at").limit(100),
  ]);
  const toReview = (pending ?? []) as Ev[];
  const live = (upcoming ?? []) as Ev[];

  // même jour que des événements déjà validés : signalé à l'équipe
  const dayOf = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Dakar" }).format(new Date(iso));
  const liveDays = new Map<string, Ev[]>();
  for (const e of live) liveDays.set(dayOf(e.starts_at), [...(liveDays.get(dayOf(e.starts_at)) ?? []), e]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Événements</h1>
        <p className="mt-1 text-mute">Validez les annonces des organisateurs : elles apparaissent alors au calendrier gospel.</p>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold">À valider ({toReview.length})</h2>
        {toReview.length === 0 && <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Aucune annonce en attente.</p>}
        {toReview.map((e) => {
          const same = liveDays.get(dayOf(e.starts_at)) ?? [];
          return (
            <article key={e.id} className="rounded-[var(--radius-card)] bg-white p-5">
              <div className="flex flex-wrap gap-4">
                {e.poster_url && (
                  <a href={e.poster_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.poster_url} alt="" className="h-36 w-28 rounded-xl object-cover" />
                  </a>
                )}
                <div className="min-w-0 flex-1">
                  <p className="eyebrow text-plum">{EVENT_CATEGORIES[e.category]}</p>
                  <p className="mt-1 font-display text-xl font-bold">{e.title}</p>
                  <p className="text-mute first-letter:uppercase">{formatDate(e.starts_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} à {formatTime(e.starts_at)} · {[e.venue, e.city].filter(Boolean).join(", ")}</p>
                  <p className="mt-1 text-sm">Organisé par <strong>{e.organizer}</strong>{e.contact_phone && ` · ${e.contact_phone}`}{e.contact_email && ` · ${e.contact_email}`}</p>
                  {same.length > 0 && (
                    <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                      Même jour que : {same.map((x) => `${x.title} (${x.city})`).join(", ")}
                    </p>
                  )}
                  {e.description && <p className="mt-2 line-clamp-4 text-sm whitespace-pre-line text-ink/80">{e.description}</p>}
                </div>
              </div>
              <form action={reviewEvent} className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
                <input type="hidden" name="id" value={e.id} />
                <label className="min-w-56 flex-1">
                  <span className="label">Motif en cas de refus (interne)</span>
                  <input name="note" maxLength={500} className="field py-2.5" />
                </label>
                <button name="decision" value="reject" className="btn min-h-10 border border-red-300 text-red-700 hover:bg-red-50">Refuser</button>
                <button name="decision" value="approve" className="btn-primary min-h-10">Publier au calendrier</button>
              </form>
            </article>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold">Au calendrier ({live.length})</h2>
        {live.length === 0 ? (
          <p className="rounded-[var(--radius-card)] bg-white p-6 text-mute">Aucun événement à venir.</p>
        ) : (
          <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white">
            {live.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <span className="w-28 shrink-0 text-sm text-mute tabular-nums">{formatDate(e.starts_at, { day: "2-digit", month: "short", year: "numeric" })}</span>
                <Link href={`/evenements/${e.slug}`} target="_blank" className="min-w-0 flex-1 truncate font-medium hover:underline">{e.title}</Link>
                <span className="text-sm text-mute">{e.city}</span>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="text-sm text-red-700 underline">Retirer</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
