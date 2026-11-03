import type { Metadata } from "next";
import Link from "next/link";
import { PACKS } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { IconCheck, IconMegaphone, IconMic, IconTicket } from "@/components/icons";

export const metadata: Metadata = {
  title: "Services et packs de promotion",
  description: "Promotion musicale, promotion d'événements, interviews, teasers et couverture média : les packs MGS pour faire connaître les projets gospel.",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  { Icon: IconMegaphone, title: "Promotion musicale", text: "Sorties de singles, clips et albums relayées sur le site et les réseaux MGS." },
  { Icon: IconTicket, title: "Promotion d'événements", text: "Concerts, festivals et veillées annoncés au calendrier gospel et sur nos réseaux." },
  { Icon: IconMic, title: "Couverture média", text: "Interviews, teasers, couverture de concerts et passages en émission." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-ink pt-16 pb-14 text-white">
        <div className="container-x">
          <p className="eyebrow text-orchid">Services</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-6xl">Donner de la voix à votre projet</h1>
          <p className="mt-5 max-w-2xl text-lg text-haze">MGS accompagne les artistes, les églises et les organisateurs pour que le gospel soit vu, entendu et partagé.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {SERVICES.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-[var(--radius-card)] bg-night p-6">
                <Icon className="size-7 text-orchid" />
                <p className="mt-4 font-display text-xl font-bold">{title}</p>
                <p className="mt-2 text-haze">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Les packs</h2>
        <p className="mt-3 max-w-2xl text-mute">Payables par Wave ou Orange Money, après vérification de votre projet par l&apos;équipe.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PACKS.map((p) => {
            const hot = p.id === "premium";
            return (
              <div key={p.id} className={`flex flex-col rounded-[var(--radius-card)] border p-7 ${hot ? "border-plum bg-plum text-white" : "border-line bg-white"}`}>
                {hot && <p className="eyebrow mb-3 text-white/80">Le plus complet en visibilité</p>}
                <p className="font-display text-2xl font-bold">{p.name}</p>
                <p className={`mt-1 ${hot ? "text-white/80" : "text-mute"}`}>{p.summary}</p>
                <p className="mt-6 font-display text-4xl font-bold">{formatPrice(p.price)}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => <li key={f} className="flex gap-2.5"><IconCheck className="mt-0.5 size-5 shrink-0" />{f}</li>)}
                </ul>
                <Link href={`/soumettre?pack=${p.id}`} className={`mt-8 ${hot ? "btn-light" : "btn-primary"}`}>Soumettre avec ce pack</Link>
              </div>
            );
          })}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] bg-white p-7">
          <div>
            <p className="font-display text-xl font-bold">Église, label, marque : un besoin particulier ?</p>
            <p className="mt-1 text-mute">Sponsorisation, partenariat, production vidéo ou community management : parlons-en.</p>
          </div>
          <Link href="/contact?sujet=partenariat" className="btn-primary">Nous contacter</Link>
        </div>
      </section>
    </>
  );
}
