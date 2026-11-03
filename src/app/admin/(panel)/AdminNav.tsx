"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/soumissions", label: "Projets soumis" },
  { href: "/admin/evenements", label: "Événements" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/titres", label: "Titres à valider" },
  { href: "/admin/catalogue", label: "Catalogue" },
  { href: "/admin/artistes", label: "Artistes" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
  { href: "/admin/mises-en-avant", label: "Mises en avant" },
  { href: "/admin/annonces", label: "Annonces audio" },
  { href: "/admin/signalements", label: "Signalements" },
  { href: "/admin/statistiques", label: "Statistiques" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/journal", label: "Journal" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6">
      {ITEMS.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${active ? "bg-plum text-white" : "text-haze hover:bg-white/5 hover:text-white"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
