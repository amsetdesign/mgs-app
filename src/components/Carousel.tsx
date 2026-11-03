"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrow } from "./icons";

/** Rangée défilante avec flèches gauche/droite (le défilement au doigt reste possible sur mobile). */
export default function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow = "absolute top-[38%] z-10 size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_24px_-8px_rgb(12_9_15/0.45)] ring-1 ring-line transition-opacity hover:bg-plum hover:text-white disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="relative" role="region" aria-roledescription="carrousel" aria-label={label}>
      <button type="button" onClick={() => go(-1)} disabled={!canPrev} aria-label="Artistes précédents" className={`${arrow} left-0 -translate-x-1/2 hidden sm:flex`}>
        <IconArrow className="size-5 rotate-180" />
      </button>
      <div ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <button type="button" onClick={() => go(1)} disabled={!canNext} aria-label="Artistes suivants" className={`${arrow} right-0 translate-x-1/2 hidden sm:flex`}>
        <IconArrow className="size-5" />
      </button>
    </div>
  );
}
