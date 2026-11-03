"use client";

import { useState } from "react";
import { IconPlay } from "./icons";

/** Vignette YouTube cliquable : la vidéo (et ses scripts) ne se charge qu'au clic. */
export default function YoutubeFacade({ id, title, className = "", caption = true }: { id: string; title: string; className?: string; caption?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink ${className}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={`Lire la vidéo : ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-plum text-white shadow-lg transition-transform group-hover:scale-110 sm:size-20">
            <IconPlay className="ml-1 size-7 sm:size-8" />
          </span>
          {caption && <span className="absolute bottom-3 left-4 text-left text-sm font-semibold text-white">{title}</span>}
        </button>
      )}
    </div>
  );
}
