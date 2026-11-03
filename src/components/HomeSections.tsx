import Link from "next/link";
import type { Article, EventItem } from "@/lib/data";
import { ARTICLE_CATEGORIES, EVENT_CATEGORIES } from "@/lib/labels";
import { formatDate, formatTime } from "@/lib/format";
import { Visual } from "./Cards";
import NewsletterForm from "./NewsletterForm";
import { IconArrow, IconCalendar, IconClock, IconMic, IconPin, IconTicket } from "./icons";

/**
 * Actualités : l'article le plus récent « À la une » à gauche, les suivants en liste à droite.
 * Tant qu'il y a peu d'articles, la colonne de droite est complétée (newsletter, proposer un sujet).
 */
export function NewsBlock({ articles }: { articles: Article[] }) {
  const [lead, ...rest] = articles;
  const others = rest.slice(0, 3);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
      <Link href={`/actualites/${lead.slug}`} className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[0_18px_40px_-24px_rgb(128_0_128/0.55)] ring-1 ring-line">
        <div className="relative aspect-[2/1] overflow-hidden">
          <Visual src={lead.cover_url} alt="" label="MGS" className="size-full transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]" />
          <span className="absolute top-4 left-4 rounded-full bg-plum px-3 py-1 text-xs font-semibold text-white shadow">À la une</span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="eyebrow text-plum">{ARTICLE_CATEGORIES[lead.category]} · {formatDate(lead.published_at)}</p>
          <h3 className="mt-2 font-display text-2xl leading-snug font-bold group-hover:underline sm:text-3xl">{lead.title}</h3>
          {lead.excerpt && <p className="mt-3 line-clamp-3 text-mute">{lead.excerpt}</p>}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-plum">Lire l&apos;article <IconArrow className="size-4" /></span>
        </div>
      </Link>

      <div className="flex flex-col gap-4">
        {others.map((a) => (
          <Link key={a.id} href={`/actualites/${a.slug}`} className="group flex gap-4 rounded-[var(--radius-card)] bg-white p-3 ring-1 ring-line transition-shadow hover:shadow-[0_12px_28px_-18px_rgb(128_0_128/0.5)]">
            <div className="w-28 shrink-0 overflow-hidden rounded-xl">
              <Visual src={a.cover_url} alt="" label="MGS" className="aspect-[4/3] w-full" />
            </div>
            <div className="min-w-0 py-1">
              <p className="text-[11px] font-semibold tracking-wide text-plum uppercase">{ARTICLE_CATEGORIES[a.category]}</p>
              <p className="mt-1 line-clamp-2 font-display font-semibold leading-snug group-hover:underline">{a.title}</p>
              <p className="mt-1 text-xs text-mute">{formatDate(a.published_at)}</p>
            </div>
          </Link>
        ))}
        {others.length < 3 && (
          <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-plum to-[#3c096c] p-5 text-white">
            <p className="font-display text-lg font-bold">Ne manquez aucune sortie</p>
            <p className="mt-1 mb-4 text-sm text-white/80">Les nouveaux articles, sorties et événements, directement dans votre boîte e-mail.</p>
            <NewsletterForm source="accueil-actus" />
          </div>
        )}
        {others.length < 2 && (
          <Link href="/contact?sujet=presse" className="group relative flex flex-1 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-orchid/35 p-5 transition-colors hover:bg-orchid/55">
            <IconMic className="absolute -top-4 -right-4 size-40 rotate-12 text-plum/10" />
            <p className="relative font-display text-lg font-bold text-plum-700">Une info, une sortie, un témoignage ?</p>
            <p className="mt-1 text-sm text-ink/75">Proposez un sujet à la rédaction de MGS.</p>
            <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-plum">Écrire à la rédaction <IconArrow className="size-4" /></span>
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Agenda : le prochain événement en grand (affiche + infos + billetterie), les suivants à droite.
 * La carte « Annoncer un événement » complète toujours la colonne.
 */
export function EventsBlock({ events }: { events: EventItem[] }) {
  const [next, ...rest] = events;
  const others = rest.slice(0, 3);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
      <div className="grid overflow-hidden rounded-[var(--radius-card)] bg-white/[0.06] ring-1 ring-white/10 sm:grid-cols-[minmax(0,0.85fr)_1fr]">
        <Link href={`/evenements/${next.slug}`} className="relative block overflow-hidden bg-black/30">
          <Visual src={next.poster_url} alt={`Affiche : ${next.title}`} label={next.title} className="aspect-[3/4] size-full sm:aspect-auto" />
          <span className="absolute top-4 left-4 rounded-full bg-orchid px-3 py-1 text-xs font-semibold text-ink shadow">Prochain rendez-vous</span>
        </Link>
        <div className="flex flex-col p-6">
          <p className="eyebrow text-orchid">{EVENT_CATEGORIES[next.category]}</p>
          <Link href={`/evenements/${next.slug}`} className="mt-2 font-display text-2xl leading-snug font-bold hover:underline sm:text-3xl">{next.title}</Link>
          <p className="mt-1 text-sm text-haze">Organisé par {next.organizer}</p>
          <ul className="mt-5 space-y-2.5 text-white/90">
            <li className="flex items-start gap-2.5"><IconCalendar className="mt-0.5 size-5 shrink-0 text-orchid" /><span className="first-letter:uppercase">{formatDate(next.starts_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></li>
            <li className="flex items-start gap-2.5"><IconClock className="mt-0.5 size-5 shrink-0 text-orchid" />À partir de {formatTime(next.starts_at)}</li>
            <li className="flex items-start gap-2.5"><IconPin className="mt-0.5 size-5 shrink-0 text-orchid" />{[next.venue, next.city].filter(Boolean).join(", ")}</li>
          </ul>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {next.ticket_url && (
              <a href={next.ticket_url} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-10 px-5"><IconTicket className="size-4" />Billetterie</a>
            )}
            <Link href={`/evenements/${next.slug}`} className="btn min-h-10 bg-white px-5 text-ink hover:bg-orchid">Voir l&apos;événement</Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {others.map((e) => (
          <Link key={e.id} href={`/evenements/${e.slug}`} className="group flex items-center gap-4 rounded-[var(--radius-card)] bg-white/[0.06] p-3 ring-1 ring-white/10 hover:bg-white/[0.1]">
            <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white leading-none text-ink">
              <span className="font-display text-xl font-bold">{formatDate(e.starts_at, { day: "2-digit" })}</span>
              <span className="text-[10px] font-semibold uppercase">{formatDate(e.starts_at, { month: "short" }).replace(".", "")}</span>
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold tracking-wide text-orchid uppercase">{EVENT_CATEGORIES[e.category]}</span>
              <span className="block truncate font-medium group-hover:underline">{e.title}</span>
              <span className="block truncate text-xs text-haze">{e.city} · {formatTime(e.starts_at)}</span>
            </span>
          </Link>
        ))}
        <Link href="/evenements/soumettre" className="group flex flex-1 flex-col justify-center rounded-[var(--radius-card)] bg-gradient-to-br from-plum to-[#3c096c] p-5 ring-1 ring-white/10">
          <p className="font-display text-lg font-bold">Vous organisez un événement ?</p>
          <p className="mt-1 text-sm text-white/80">Annoncez-le gratuitement au calendrier gospel. Le formulaire vous signale les dates déjà prises.</p>
          <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-plum">Annoncer un événement <IconArrow className="size-4" /></span>
        </Link>
        {others.length < 2 && (
          <Link href="/evenements" className="group flex items-center justify-between gap-3 rounded-[var(--radius-card)] bg-white/[0.06] p-5 ring-1 ring-white/10 hover:bg-white/[0.1]">
            <span>
              <span className="block font-display text-lg font-bold">Tout le calendrier gospel</span>
              <span className="block text-sm text-haze">Concerts, veillées et festivals à venir</span>
            </span>
            <IconArrow className="size-5 text-orchid" />
          </Link>
        )}
      </div>
    </div>
  );
}
