import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/logo.png";
import logoWhite from "../../public/brand/logo-white.png";

export default function Logo({ dark = false, className = "h-9 w-auto" }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Music Gospel Sénégal, accueil" className="inline-flex shrink-0">
      <Image src={dark ? logoWhite : logo} alt="Music Gospel Sénégal" className={className} priority />
    </Link>
  );
}
