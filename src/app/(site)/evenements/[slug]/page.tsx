import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/data";
import { Visual } from "@/components/Cards";
import { IconCalendar, IconClock, IconMail, IconPhone, IconPin, IconTicket } from "@/components/icons";
import { EVENT_CATEGORIES } from "@/lib/labels";
import { formatDate, formatTime, isPast } from "@/lib/format";
import { SITE } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return { title: "Événement introuvable" };
  const when = formatDate(event.starts_at);
  return {
    title: `${event.title}, ${when} à ${event.city}`,
    description: event.description.slice(0, 155) || `${EVENT_CATEGORIES[event.category]} organisé par ${event.organizer} le ${when} à ${event.city}.`,
    alternates: { canonical: `/evenements/${event.slug}` },
    openGraph: { title: event.title, images: event.poster_url ? [event.poster_url] : undefined },
  };
}

export default async function EventPage({ params }: Props) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();
  const past = isPast(event.ends_at ?? event.starts_at, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    startDate: event.starts_at,
    ...(event.ends_at ? { endDate: event.ends_at } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.venue || event.city, address: { "@type": "PostalAddress", addressLocality: event.city, addressCountry: event.country } },
    organizer: { "@type": "Organization", name: event.organizer },
    ...(event.poster_url ? { image: [event.poster_url] } : {}),
    ...(event.description ? { description: event.description } : {}),
    ...(event.ticket_url ? { offers: { "@type": "Offer", url: event.ticket_url } } : {}),
    url: `${SITE.url}/evenements/${event.slug}`,
  };

  const rows = [
    { Icon: IconCalendar, text: formatDate(event.starts_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    { Icon: IconClock, text: `${formatTime(event.starts_at)}${event.ends_at ? ` – ${formatTime(event.ends_at)}` : ""}` },
    { Icon: IconPin, text: [event.venue, event.city, event.country].filter(Boolean).join(", ") },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="bg-ink text-white">
        <div className="container-x grid gap-10 py-14 md:grid-cols-[minmax(0,360px)_1fr] lg:py-20">
          <div className="overflow-hidden rounded-[24px]">
            <Visual src={event.poster_url} alt={`Affiche : ${event.title}`} label={event.title} className="aspect-[3/4] w-full" />
          </div>
          <div>
            <Link href={`/evenements?categorie=${event.category}`} className="eyebrow text-orchid hover:underline">{EVENT_CATEGORIES[event.category]}</Link>
            <h1 className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight sm:text-5xl">{event.title}</h1>
            <p className="mt-3 text-haze">Organisé par {event.organizer}</p>
            {past && <p className="mt-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm">Cet événement est passé</p>}
            <ul className="mt-8 space-y-3">
              {rows.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-lg first-letter:uppercase">
                  <Icon className="mt-1 size-5 shrink-0 text-orchid" />
                  <span className="first-letter:uppercase">{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              {event.ticket_url && !past && (
                <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" className="btn-primary"><IconTicket className="size-5" />Billetterie</a>
              )}
              {event.contact_phone && <a href={`tel:${event.contact_phone.replace(/[^+0-9]/g, "")}`} className="btn-ghost text-white"><IconPhone className="size-4" />{event.contact_phone}</a>}
              {event.contact_email && <a href={`mailto:${event.contact_email}`} className="btn-ghost text-white"><IconMail className="size-4" />Écrire à l&apos;organisateur</a>}
            </div>
          </div>
        </div>
      </section>
      {event.description && (
        <section className="container-x max-w-3xl py-14">
          <h2 className="font-display text-2xl font-bold">À propos de l&apos;événement</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink/85">
            {event.description.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>
      )}
      <section className="container-x pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] bg-white p-6">
          <p className="text-mute">Vous organisez aussi un événement gospel ?</p>
          <Link href="/evenements/soumettre" className="btn-primary">Annoncer un événement</Link>
        </div>
      </section>
    </>
  );
}
