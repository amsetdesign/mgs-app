import Link from "next/link";
import type { Article, Artist, EventItem, Song } from "@/lib/data";
import { artistName } from "@/lib/data";
import type { SongRow } from "./SongList";
import { ARTICLE_CATEGORIES, EVENT_CATEGORIES } from "@/lib/labels";
import { formatDate, formatTime } from "@/lib/format";
import { IconBadge, IconCalendar, IconPin } from "./icons";

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

/** Visuel réel ou, à défaut, monogramme sur fond violet (jamais d'image d'illustration inventée). */
export function Visual({ src, alt, label, className }: { src: string; alt: string; label: string; className: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className={`${className} object-cover`} />;
  }
  return (
    <div className={`${className} flex items-center justify-center bg-plum`} aria-hidden>
      <span className="font-display text-4xl font-bold text-white/90">{initials(label)}</span>
    </div>
  );
}

export const toSongRow = (s: Song & { plays?: number }): SongRow => ({
  id: s.id,
  title: s.title,
  audio_url: s.audio_url,
  cover_url: s.cover_url,
  duration: s.duration,
  artistName: artistName(s.artists),
  artistSlug: s.artists?.slug,
  plays: s.plays,
});

export function ArtistCard({ artist, dark = false }: { artist: Artist & { songCount?: number }; dark?: boolean }) {
  const name = artist.profiles?.full_name || "Artiste";
  const meta = [artist.profiles?.country, artist.songCount ? `${artist.songCount} titre${artist.songCount > 1 ? "s" : ""}` : ""].filter(Boolean).join(" · ");
  return (
    <Link href={`/artistes/${artist.slug}`} className="group block">
      <div className="overflow-hidden rounded-[var(--radius-card)]">
        <Visual src={artist.profiles?.avatar_url ?? ""} alt={name} label={name} className="aspect-square w-full transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]" />
      </div>
      <p className={`mt-3 flex items-center gap-1.5 font-display text-lg font-semibold leading-tight ${dark ? "text-white" : ""}`}>
        {name}
        {artist.verified && <IconBadge className={`size-4 ${dark ? "text-orchid" : "text-plum"}`} />}
      </p>
      <p className={`text-sm ${dark ? "text-haze" : "text-mute"}`}>{meta || "Artiste gospel"}</p>
    </Link>
  );
}

export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <Link href={`/actualites/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-[var(--radius-card)]">
        <Visual src={article.cover_url} alt="" label="MGS" className={`${large ? "aspect-[16/10]" : "aspect-[16/11]"} w-full transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]`} />
      </div>
      <p className="eyebrow mt-4 text-plum">{ARTICLE_CATEGORIES[article.category]}</p>
      <h3 className={`mt-1.5 font-display font-semibold leading-snug group-hover:underline ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>{article.title}</h3>
      {article.excerpt && <p className={`mt-2 text-mute ${large ? "" : "line-clamp-2 text-sm"}`}>{article.excerpt}</p>}
      <p className="mt-2 text-xs text-mute">{formatDate(article.published_at)}</p>
    </Link>
  );
}

export function EventCard({ event, dark = false }: { event: EventItem; dark?: boolean }) {
  const day = formatDate(event.starts_at, { day: "2-digit" });
  const month = formatDate(event.starts_at, { month: "short" }).replace(".", "");
  const sub = dark ? "text-haze" : "text-mute";
  return (
    <Link
      href={`/evenements/${event.slug}`}
      className={`group flex gap-4 rounded-[var(--radius-card)] p-3 transition-colors ${dark ? "bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.1]" : "bg-white hover:shadow-[0_10px_30px_-15px_rgb(12_9_15/0.35)]"}`}
    >
      <div className="relative w-24 shrink-0 overflow-hidden rounded-xl sm:w-28">
        <Visual src={event.poster_url} alt="" label={event.title} className="aspect-[3/4] w-full" />
        <div className="absolute top-2 left-2 rounded-lg bg-white px-2 py-1 text-center leading-none text-ink">
          <span className="block font-display text-lg font-bold">{day}</span>
          <span className="block text-[10px] font-semibold uppercase">{month}</span>
        </div>
      </div>
      <div className="min-w-0 py-1">
        <p className={`eyebrow ${dark ? "text-orchid" : "text-plum"}`}>{EVENT_CATEGORIES[event.category]}</p>
        <h3 className={`mt-1 font-display text-lg font-semibold leading-snug group-hover:underline ${dark ? "text-white" : ""}`}>{event.title}</h3>
        <p className={`mt-2 flex items-center gap-1.5 text-sm ${sub}`}>
          <IconCalendar className="size-4 shrink-0" />
          <span className="first-letter:uppercase">{formatDate(event.starts_at, { weekday: "long", day: "numeric", month: "long" })} · {formatTime(event.starts_at)}</span>
        </p>
        <p className={`mt-1 flex items-center gap-1.5 text-sm ${sub}`}>
          <IconPin className="size-4 shrink-0" />
          <span className="truncate">{[event.venue, event.city].filter(Boolean).join(", ")}</span>
        </p>
      </div>
    </Link>
  );
}

export function EmptyState({ title, text, action, dark = false }: { title: string; text: string; action?: { href: string; label: string }; dark?: boolean }) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-dashed px-6 py-12 text-center ${dark ? "border-white/20 bg-white/[0.04] text-white" : "border-line bg-white"}`}>
      <p className="font-display text-xl font-semibold">{title}</p>
      <p className={`mx-auto mt-2 max-w-md ${dark ? "text-haze" : "text-mute"}`}>{text}</p>
      {action && <Link href={action.href} className="btn-primary mt-6">{action.label}</Link>}
    </div>
  );
}

export function SectionHead({ eyebrow, title, link, dark = false }: { eyebrow: string; title: string; link?: { href: string; label: string }; dark?: boolean }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`eyebrow ${dark ? "text-orchid" : "text-plum"}`}>{eyebrow}</p>
        <h2 className={`mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl ${dark ? "text-white" : ""}`}>{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className={`text-sm font-semibold underline-offset-4 hover:underline ${dark ? "text-orchid" : "text-plum"}`}>
          {link.label}
        </Link>
      )}
    </div>
  );
}
