import Image from "next/image";
import Link from "next/link";
import { REALISATIONS } from "@/lib/realisations";

/** Références de MGS : événements organisés ou accompagnés en communication. */
export default function Realisations({ dark = false }: { dark?: boolean }) {
  const sub = dark ? "text-haze" : "text-mute";
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {REALISATIONS.map((r) => {
        const body = (
          <>
            <div className={`relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] ${r.image?.poster ? "bg-paper" : "bg-plum"}`}>
              {r.image ? (
                <Image
                  src={r.image.src}
                  alt={r.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className={`${r.image.poster ? "object-contain" : "object-cover"} transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]`}
                />
              ) : (
                <div className="flex size-full items-end p-6">
                  <p className="font-display text-3xl leading-tight font-bold text-white">{r.title}</p>
                </div>
              )}
              <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">{r.role}</span>
            </div>
            <p className={`mt-4 font-display text-xl font-bold ${dark ? "text-white" : ""} ${r.href || r.external ? "group-hover:underline" : ""}`}>{r.title}</p>
            <p className={`text-sm ${sub}`}>{[r.date, r.place].filter(Boolean).join(" · ")}</p>
            <p className={`mt-2 text-sm leading-relaxed ${sub}`}>{r.summary}</p>
          </>
        );
        if (r.href) return <Link key={r.title} href={r.href} className="group block">{body}</Link>;
        if (r.external) return <a key={r.title} href={r.external} target="_blank" rel="noopener noreferrer" className="group block">{body}</a>;
        return <div key={r.title} className="group">{body}</div>;
      })}
    </div>
  );
}
