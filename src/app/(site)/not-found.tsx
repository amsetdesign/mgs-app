import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow text-plum">Page introuvable</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Cette page n&apos;existe pas ou plus</h1>
      <p className="mt-3 text-mute">Le lien est peut-être ancien. Retrouvez les artistes, les actualités et le calendrier depuis l&apos;accueil.</p>
      <Link href="/" className="btn-primary mt-8">Retour à l&apos;accueil</Link>
    </section>
  );
}
