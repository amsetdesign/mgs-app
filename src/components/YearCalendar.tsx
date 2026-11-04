"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconArrow, IconCalendar, IconCheck } from "./icons";

type Ev = { slug: string; title: string; city: string; starts_at: string; category: string };

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS = ["L", "M", "M", "J", "V", "S", "D"];
// Dakar est à UTC+0 toute l'année : la date du jour UTC est la date locale
const dayKey = (iso: string) => iso.slice(0, 10);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Calendrier annuel du gospel : jours pris en couleur, jours libres cliquables pour annoncer un événement.
 * Aide les organisateurs à choisir une date sans concurrence.
 */
export default function YearCalendar({ year, events, today }: { year: number; events: Ev[]; today: string }) {
  const byDay = useMemo(() => {
    const m = new Map<string, Ev[]>();
    for (const e of events) m.set(dayKey(e.starts_at), [...(m.get(dayKey(e.starts_at)) ?? []), e]);
    return m;
  }, [events]);
  const [selected, setSelected] = useState<string | null>(null);
  const busyDays = byDay.size;
  const picked = selected ? byDay.get(selected) ?? [] : [];
  const pickedLabel = selected
    ? new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${selected}T12:00:00Z`))
    : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href={`/evenements?annee=${year - 1}#calendrier`} className="flex size-10 items-center justify-center rounded-full bg-white ring-1 ring-line hover:bg-plum hover:text-white" aria-label={`Année ${year - 1}`}>
            <IconArrow className="size-4 rotate-180" />
          </Link>
          <p className="min-w-24 text-center font-display text-2xl font-bold">{year}</p>
          <Link href={`/evenements?annee=${year + 1}#calendrier`} className="flex size-10 items-center justify-center rounded-full bg-white ring-1 ring-line hover:bg-plum hover:text-white" aria-label={`Année ${year + 1}`}>
            <IconArrow className="size-4" />
          </Link>
        </div>
        <ul className="flex flex-wrap items-center gap-4 text-sm text-mute">
          <li className="flex items-center gap-2"><span className="size-4 rounded-md bg-plum" /> Date prise ({busyDays} jour{busyDays > 1 ? "s" : ""})</li>
          <li className="flex items-center gap-2"><span className="size-4 rounded-md bg-white ring-1 ring-line" /> Date libre</li>
          <li className="flex items-center gap-2"><span className="size-4 rounded-md ring-2 ring-orchid" /> Aujourd&apos;hui</li>
        </ul>
      </div>

      {selected && (
        <div role="status" className={`rounded-[var(--radius-card)] p-5 ${picked.length ? "bg-plum text-white" : "bg-white ring-1 ring-line"}`}>
          <p className="font-display text-lg font-bold first-letter:uppercase">{pickedLabel}</p>
          {picked.length ? (
            <>
              <p className="mt-1 text-sm text-white/80">
                {picked.length === 1 ? "Un événement est déjà prévu ce jour-là." : `${picked.length} événements sont déjà prévus ce jour-là.`} Organisateurs : choisissez de préférence une autre date.
              </p>
              <ul className="mt-3 space-y-2">
                {picked.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/evenements/${e.slug}`} className="flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-2.5 hover:bg-white/20">
                      <span className="min-w-0"><span className="block truncate font-medium">{e.title}</span><span className="text-xs text-white/75">{e.city} · {e.starts_at.slice(11, 16).replace(":", " h ")}</span></span>
                      <IconArrow className="size-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : selected < today ? (
            <p className="mt-1 text-sm text-mute">Cette date est passée.</p>
          ) : (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm text-plum"><IconCheck className="size-4" />Cette date est libre au calendrier gospel.</p>
              <Link href={`/evenements/soumettre?date=${selected}`} className="btn-primary min-h-10 px-5">Annoncer un événement ce jour-là</Link>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MONTHS.map((name, m) => {
          const first = new Date(Date.UTC(year, m, 1));
          const offset = (first.getUTCDay() + 6) % 7; // lundi en premier
          const count = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
          const monthEvents = [...byDay.entries()].filter(([d]) => d.startsWith(`${year}-${pad(m + 1)}`)).reduce((n, [, l]) => n + l.length, 0);
          return (
            <div key={name} className="rounded-[var(--radius-card)] bg-white p-4 ring-1 ring-line">
              <div className="mb-3 flex items-baseline justify-between">
                <p className="font-display font-bold">{name}</p>
                {monthEvents > 0 && <span className="rounded-full bg-plum/10 px-2 py-0.5 text-xs font-semibold text-plum">{monthEvents} évén.</span>}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-mute">
                {DAYS.map((d, i) => <span key={i} className="pb-1 font-semibold">{d}</span>)}
                {Array.from({ length: offset }, (_, i) => <span key={`v${i}`} />)}
                {Array.from({ length: count }, (_, i) => {
                  const key = `${year}-${pad(m + 1)}-${pad(i + 1)}`;
                  const busy = byDay.get(key);
                  const past = key < today;
                  const isToday = key === today;
                  const isSel = key === selected;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelected(isSel ? null : key)}
                      aria-pressed={isSel}
                      aria-label={`${i + 1} ${name}${busy ? ` : ${busy.length} événement${busy.length > 1 ? "s" : ""}` : " : libre"}`}
                      className={`relative aspect-square rounded-md text-xs font-medium transition-colors ${
                        busy ? "bg-plum text-white hover:bg-plum-700" : past ? "text-mute/50" : "text-ink hover:bg-orchid/40"
                      } ${isToday ? "ring-2 ring-orchid" : ""} ${isSel ? "outline-2 outline-offset-1 outline-ink" : ""}`}
                    >
                      {i + 1}
                      {busy && busy.length > 1 && <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-orchid text-[8px] text-ink">{busy.length}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="flex items-center gap-2 text-sm text-mute"><IconCalendar className="size-4" />Touchez un jour pour voir les événements prévus ou vérifier qu&apos;il est libre.</p>
    </div>
  );
}
