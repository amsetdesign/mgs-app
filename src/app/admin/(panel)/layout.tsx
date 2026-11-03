import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import logoWhite from "../../../../public/brand/logo-white.png";
import { requireAdmin } from "@/lib/admin";
import { logoutAction } from "../auth-actions";
import AdminNav from "./AdminNav";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-ink text-white lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 px-5 py-5 lg:block">
          <Link href="/admin"><Image src={logoWhite} alt="MGS" className="h-8 w-auto" priority /></Link>
          <Link href="/" className="text-xs text-haze hover:text-white lg:mt-3 lg:block">Voir le site</Link>
        </div>
        <AdminNav />
        <div className="hidden border-t border-white/10 px-5 py-5 text-xs text-haze lg:block">
          <p className="truncate">{admin.name || admin.email}</p>
          <form action={logoutAction}><button type="submit" className="mt-2 underline hover:text-white">Se déconnecter</button></form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
