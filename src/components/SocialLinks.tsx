import { SITE } from "@/lib/site";
import { IconFacebook, IconInstagram, IconTiktok, IconYoutube } from "./icons";

const LINKS = [
  { key: "facebook", label: "Facebook", Icon: IconFacebook },
  { key: "instagram", label: "Instagram", Icon: IconInstagram },
  { key: "tiktok", label: "TikTok", Icon: IconTiktok },
  { key: "youtube", label: "YouTube", Icon: IconYoutube },
] as const;

/** Réseaux officiels MGS, ou ceux d'un artiste si `links` est fourni. */
export default function SocialLinks({ links, className = "" }: { links?: Partial<Record<(typeof LINKS)[number]["key"], string>>; className?: string }) {
  const urls = links ?? SITE.socials;
  const items = LINKS.filter((l) => urls[l.key]);
  if (items.length === 0) return null;
  return (
    <ul className={`flex gap-2 ${className}`}>
      {items.map(({ key, label, Icon }) => (
        <li key={key}>
          <a href={urls[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex size-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-current/60">
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
