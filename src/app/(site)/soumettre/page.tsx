import type { Metadata } from "next";
import ProjectForm from "./ProjectForm";
import { PACKS, type PackId } from "@/lib/site";

export const metadata: Metadata = {
  title: "Soumettre un projet",
  description: "Single, clip, album, concert : envoyez votre projet gospel à MGS pour qu'il soit présenté sur le site et nos réseaux. Pack gratuit ou sponsorisé.",
  alternates: { canonical: "/soumettre" },
};

export default async function SubmitPage({ searchParams }: { searchParams: Promise<{ pack?: string }> }) {
  const { pack } = await searchParams;
  const initial = (PACKS.find((p) => p.id === pack)?.id ?? "gratuit") as PackId;
  return (
    <>
      <section className="bg-ink pt-16 pb-12 text-white">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-orchid">Promotion</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Soumettre un projet</h1>
          <p className="mt-5 text-lg text-haze">
            Single, clip, EP, album, concert ou communiqué : présentez votre projet à l&apos;équipe MGS. Nous le vérifions puis le diffusons sur le site et nos réseaux, selon le pack choisi.
          </p>
        </div>
      </section>
      <section className="container-x max-w-3xl py-14">
        <ProjectForm initialPack={initial} />
      </section>
    </>
  );
}
