import Link from "next/link";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import SocialLinks from "./SocialLinks";
import { SITE } from "@/lib/site";
import { NAV } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo dark className="h-10 w-auto" />
          <p className="mt-5 text-sm leading-relaxed text-haze">
            Le média du gospel au Sénégal : artistes, sorties, événements et actualités, au service d&apos;une seule mission.
          </p>
          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold">Recevez les sorties et les événements</p>
            <NewsletterForm source="footer" />
          </div>
        </div>
        <nav aria-label="Pied de page" className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-haze hover:text-white">{item.label}</Link>
          ))}
          <Link href="/soumettre" className="text-haze hover:text-white">Soumettre un projet</Link>
          <Link href="/evenements/soumettre" className="text-haze hover:text-white">Annoncer un événement</Link>
          <Link href="/contact" className="text-haze hover:text-white">Contact</Link>
        </nav>
        <div className="text-sm">
          <p className="font-semibold">Nous joindre</p>
          <a href={`mailto:${SITE.email}`} className="mt-3 block break-all text-haze hover:text-white">{SITE.email}</a>
          {SITE.whatsapp && <a href={`https://wa.me/${SITE.whatsapp}`} className="mt-2 block text-haze hover:text-white">WhatsApp</a>}
          <p className="mt-2 text-haze">{SITE.city}</p>
          <SocialLinks className="mt-6" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-haze sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <div className="flex gap-5">
            <Link href="/conditions" className="hover:text-white">Conditions d&apos;utilisation</Link>
            <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
