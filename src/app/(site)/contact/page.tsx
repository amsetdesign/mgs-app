import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import SocialLinks from "@/components/SocialLinks";
import { IconMail, IconPhone, IconPin, IconWhatsapp } from "@/components/icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Music Gospel Sénégal : promotion, partenariats, presse.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sujet?: string }> }) {
  const { sujet } = await searchParams;
  const subject = sujet === "partenariat" || sujet === "presse" || sujet === "autre" ? sujet : "contact";
  return (
    <>
      <section className="bg-ink pt-16 pb-12 text-white">
        <div className="container-x">
          <p className="eyebrow text-orchid">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">Parlons de votre projet</h1>
        </div>
      </section>
      <section className="container-x grid gap-14 py-14 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-5">
          <a href={`mailto:${SITE.email}`} className="flex items-start gap-3 break-all hover:text-plum"><IconMail className="mt-0.5 size-5 shrink-0 text-plum" />{SITE.email}</a>
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-plum"><IconPhone className="size-5 text-plum" />{SITE.phone}</a>
          {SITE.whatsapp && <a href={`https://wa.me/${SITE.whatsapp}`} className="flex items-center gap-3 hover:text-plum"><IconWhatsapp className="size-5 text-plum" />Écrire sur WhatsApp</a>}
          <p className="flex items-start gap-3"><IconPin className="mt-0.5 size-5 shrink-0 text-plum" />{SITE.city}</p>
          <SocialLinks className="pt-2 text-ink" />
        </div>
        <ContactForm subject={subject} />
      </section>
    </>
  );
}
