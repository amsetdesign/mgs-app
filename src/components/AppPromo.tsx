import Image from "next/image";
import { SITE } from "@/lib/site";
import { IconCheck } from "./icons";

const Apple = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-7"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-.9-2.4-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" /></svg>
);
const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-6">
    <path fill="#34A853" d="M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z" />
    <path fill="#FBBC04" d="m16.6 15.2-3.2-3.2 3.2-3.2 3.7 2.1c1 .6 1 1.6 0 2.2z" />
    <path fill="#EA4335" d="M16.6 15.2 13.4 12l-9.8 9.7c.4.2.9.2 1.4-.1z" />
    <path fill="#4285F4" d="M16.6 8.8 5 2.4c-.5-.3-1-.3-1.4-.1L13.4 12z" />
  </svg>
);

function StoreBadge({ href, top, name, icon }: { href: string; top: string; name: string; icon: React.ReactNode }) {
  const inner = (
    <>
      {icon}
      <span className="text-left leading-tight">
        <span className="block text-[10px] tracking-wide text-white/75 uppercase">{href ? top : "Bientôt sur"}</span>
        <span className="block font-display text-lg font-semibold">{name}</span>
      </span>
    </>
  );
  const cls = "inline-flex h-14 min-w-44 items-center gap-3 rounded-xl bg-ink px-4 text-white ring-1 ring-white/20";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} transition-transform hover:-translate-y-0.5`}>{inner}</a>
  ) : (
    <span className={`${cls} cursor-default`} aria-label={`Bientôt sur ${name}`}>{inner}</span>
  );
}

/** Bloc de l'application mobile : vraie capture dans un téléphone et badges des stores. */
export default function AppPromo() {
  return (
    <section className="container-x pt-24 pb-16">
      <div className="relative grid gap-10 overflow-visible rounded-[28px] bg-plum px-7 pt-10 text-white sm:px-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:pt-0">
        <div className="lg:py-14">
          <p className="eyebrow text-white/75">Application mobile</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Tout le gospel dans votre poche</h2>
          <p className="mt-4 max-w-xl text-white/85">Écoutez gratuitement, suivez vos artistes, créez vos playlists. Les artistes publient leurs titres et suivent leurs écoutes.</p>
          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            {["Écoute gratuite", "Paroles des titres", "Notifications des sorties", "Espace artiste"].map((f) => (
              <li key={f} className="flex items-center gap-2"><IconCheck className="size-4 shrink-0" />{f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <StoreBadge href={SITE.playStore} top="Disponible sur" name="Google Play" icon={<Play />} />
            <StoreBadge href={SITE.appStore} top="Télécharger dans" name="App Store" icon={<Apple />} />
          </div>
        </div>

        {/* téléphone : capture réelle de l'application (page artiste) */}
        <div className="relative mx-auto h-[360px] w-[250px] overflow-hidden rounded-t-[44px] sm:h-[420px] sm:w-[280px] lg:-mt-16 lg:h-[500px] lg:self-end">
          <div className="absolute inset-x-0 top-0 rounded-[44px] bg-ink p-[10px] shadow-[0_30px_60px_-20px_rgb(12_9_15/0.7)] ring-1 ring-white/10">
            <div className="relative overflow-hidden rounded-[34px] bg-ink">
              <Image src="/photos/app/page-artiste.webp" alt="L'application MGS : page de l'artiste Amset de Jesus avec ses titres" width={780} height={1688} sizes="280px" className="h-auto w-full" />
              <span aria-hidden className="absolute top-2.5 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-ink" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
