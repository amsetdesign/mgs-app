import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CGU } from "@/lib/legal";

export const metadata: Metadata = { title: CGU.title, alternates: { canonical: "/conditions" } };

export default function TermsPage() {
  return <LegalPage {...CGU} />;
}
