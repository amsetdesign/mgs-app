import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = { title: PRIVACY.title, alternates: { canonical: "/confidentialite" } };

export default function PrivacyPage() {
  return <LegalPage {...PRIVACY} />;
}
