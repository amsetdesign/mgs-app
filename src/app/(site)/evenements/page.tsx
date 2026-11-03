import type { Metadata } from "next";
import Link from "next/link";
import { getEventCities, getUpcomingEvents } from "@/lib/data";
import { EmptyState, EventCard } from "@/components/Cards";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/labels";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Calendrier gospel : concerts et événements",
  description: "Le calendrier des concerts, festivals, veillées et événements gospel au Sénégal. Organisateurs : annoncez votre date pour éviter les chevauchements.",
  alternates: { canonical: "/evenements" },
};

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ ville?: string; categorie?: string }> }) {
  const { ville, categorie } = await searchParams;
  const category = categorie && categorie in EVENT_CATEGORIES ? (categorie as EventCategory) : undefined;
  const [events, cities] = await Promise.all([getUpcomingEvents({ city: ville, category }), getEventCities()]);

  // regroupement par mois
  const months = new Map<string, typeof events>();
  for (const e of events) {
    const key = formatDate(e.starts_at, { month: "long", year: "numeric" });
    months.set(key, [...(months.get(key) ?? []), e]);
  }
  const filtered = Boolean(ville || category);

  return (
    <>
      <section className="bg-ink pt-16 pb-12 text-white">
        <div className="container-x">
          <p className="eyebrow text-orchid">Calendrier gospel</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-6xl">Tous les événements gospel</h1>
          <p className="mt-5 max-w-2xl text-lg text-haze">Un seul calendrier pour toute la communauté : on sait ce qui se passe, et on évite de programmer deux grands événements le même jour.</p>
          <div className="mt-8 flex flex-wrap items-end gap-4">
            <form className="flex flex-wrap items-end gap-3" action="/evenements">
              <label className="text-sm">
                <span className="mb-1.5 block text-haze">Ville</span>
                <select name="ville" defaultValue={ville ?? ""} className="min-h-11 rounded-full border border-white/20 bg-night px-4 text-white">
                  <option value="">Toutes</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block text-haze">Catégorie</span>
                <select name="categorie" defaultValue={category ?? ""} className="min-h-11 rounded-full border border-white/20 bg-night px-4 text-white">
                  <option value="">Toutes</option>
                  {(Object.keys(EVENT_CATEGORIES) as EventCategory[]).map((c) => <option key={c} value={c}>{EVENT_CATEGORIES[c]}</option>)}
                </select>
              </label>
              <button type="submit" className="btn-light">Filtrer</button>
              {filtered && <Link href="/evenements" className="min-h-11 px-2 py-3 text-sm text-haze underline">Effacer</Link>}
            </form>
            <Link href="/evenements/soumettre" className="btn-primary sm:ml-auto">Annoncer un événement</Link>
          </div>
        </div>
      </section>
      <section className="container-x py-14">
        {events.length > 0 ? (
          <div className="space-y-14">
            {[...months.entries()].map(([month, list]) => (
              <div key={month}>
                <h2 className="mb-5 font-display text-2xl font-bold first-letter:uppercase">{month}</h2>
                <div className="grid gap-4 md:grid-cols-2">{list.map((e) => <EventCard key={e.id} event={e} />)}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={filtered ? "Aucun événement pour ces critères" : "Aucun événement annoncé pour l'instant"}
            text="Organisateurs : annoncez votre concert, veillée ou festival. L'équipe MGS le vérifie puis l'ajoute au calendrier."
            action={{ href: "/evenements/soumettre", label: "Annoncer un événement" }}
          />
        )}
      </section>
    </>
  );
}
