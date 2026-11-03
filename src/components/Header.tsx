"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { IconClose, IconMenu } from "./icons";
import { NAV } from "@/lib/nav";


export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // menu refermé à chaque changement de page
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Logo dark className="h-8 w-auto" />
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${isActive(item.href) ? "text-white" : "text-haze hover:text-white"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/soumettre" className="btn-primary hidden min-h-10 px-5 sm:inline-flex">Soumettre un projet</Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-white lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="size-6" /> : <IconMenu className="size-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div id="menu-mobile" className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-ink lg:hidden">
          <nav aria-label="Navigation mobile" className="container-x flex flex-col py-6">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={`border-b border-white/10 py-4 font-display text-2xl font-semibold ${isActive(item.href) ? "text-orchid" : "text-white"}`}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="border-b border-white/10 py-4 font-display text-2xl font-semibold text-white">Contact</Link>
            <Link href="/soumettre" className="btn-primary mt-8">Soumettre un projet</Link>
            <Link href="/evenements/soumettre" className="btn-ghost mt-3 text-white">Annoncer un événement</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
