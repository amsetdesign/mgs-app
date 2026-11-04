import Link from "next/link";
import type { Metadata } from "next";
import EventForm from "./EventForm";

export const metadata: Metadata = {
  title: "Annoncer un événement gospel",
  description: "Organisateurs : ajoutez votre concert, festival ou veillée au calendrier gospel national. Gratuit, après vérification par l'équipe MGS.",
  alternates: { canonical: "/evenements/soumettre" },
};

export default async function SubmitEventPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date } = await searchParams;
  const initialDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
  return (
    <>
      <section className="bg-ink pt-16 pb-12 text-white">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-orchid">Calendrier gospel</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Annoncer un événement</h1>
          <p className="mt-5 text-lg text-haze">
            L&apos;annonce est gratuite. Vérifiez d&apos;abord les dates libres dans le <Link href="/evenements#calendrier" className="text-orchid underline">calendrier annuel</Link> : le formulaire vous signale aussi tout de suite si un autre événement est déjà prévu ce jour-là.
          </p>
        </div>
      </section>
      <section className="container-x max-w-3xl py-14">
        <EventForm initialDate={initialDate} />
      </section>
    </>
  );
}
