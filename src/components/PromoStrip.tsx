import Link from "next/link";
import { promotionTarget, type Promotion } from "@/lib/data";
import { Visual } from "./Cards";
import { IconArrow } from "./icons";

function PromoCard({ p, big }: { p: Promotion; big?: boolean }) {
  const t = promotionTarget(p);
  const inner = (
    <div className={`relative overflow-hidden rounded-[var(--radius-card)] ${big ? "aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-80" : "aspect-[16/9]"}`}>
      <Visual src={t.image} alt="" label={p.title} className="absolute inset-0 size-full transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      {p.sponsored && <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-ink uppercase">Sponsorisé</span>}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className={`font-display font-bold leading-tight ${big ? "text-2xl sm:text-3xl" : "text-lg"}`}>{p.title}</p>
        {p.subtitle && <p className={`mt-1 text-white/85 ${big ? "" : "line-clamp-1 text-sm"}`}>{p.subtitle}</p>}
        {big && <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">Découvrir <IconArrow className="size-4" /></span>}
      </div>
    </div>
  );
  return /^https?:\/\//.test(t.href) ? (
    <a href={t.href} target="_blank" rel="noopener noreferrer sponsored" className="group block h-full">{inner}</a>
  ) : (
    <Link href={t.href} className="group block h-full">{inner}</Link>
  );
}

/** Mises en avant programmées dans l'administration (packs payés, partenaires). */
export default function PromoStrip({ promotions }: { promotions: Promotion[] }) {
  if (promotions.length === 0) return null;
  const [first, ...rest] = promotions;
  return (
    <section aria-label="À la une" className="container-x pt-14">
      <div className={`grid gap-4 ${rest.length ? "lg:grid-cols-[1.6fr_1fr]" : ""}`}>
        <PromoCard p={first} big />
        {rest.length > 0 && <div className="grid gap-4">{rest.map((p) => <PromoCard key={p.id} p={p} />)}</div>}
      </div>
    </section>
  );
}
