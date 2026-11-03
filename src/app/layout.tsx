import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Poppins } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} : artistes, sorties et événements gospel`, template: `%s | ${SITE.name}` },
  description:
    "Le média du gospel au Sénégal : artistes chrétiens, nouvelles sorties, calendrier des concerts et actualités. Soumettez votre projet pour qu'il soit mis en avant.",
  applicationName: SITE.name,
  openGraph: { type: "website", locale: "fr_SN", siteName: SITE.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0c090f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${poppins.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
