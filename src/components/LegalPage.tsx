export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { title: string; body: string }[] }) {
  return (
    <>
      <section className="bg-ink pt-16 pb-12 text-white">
        <div className="container-x max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-haze">Mise à jour : {updated}</p>
        </div>
      </section>
      <section className="container-x max-w-3xl space-y-9 py-14">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-xl font-bold">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-ink/85">{s.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
