"use client";

import { useSyncExternalStore } from "react";

// Lecteur unique pour tout le site : lancer un titre arrête automatiquement le précédent,
// quelle que soit la liste (dernières sorties, sélection, page artiste…).
type State = { id: string | null; playing: boolean; progress: number };

let audio: HTMLAudioElement | null = null;
let state: State = { id: null, playing: false, progress: 0 };
const listeners = new Set<() => void>();

const emit = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

function getAudio() {
  if (audio) return audio;
  const el = new Audio();
  el.preload = "none";
  el.addEventListener("play", () => emit({ playing: true }));
  el.addEventListener("pause", () => emit({ playing: false }));
  el.addEventListener("timeupdate", () => emit({ progress: el.duration ? el.currentTime / el.duration : 0 }));
  el.addEventListener("ended", () => emit({ playing: false, progress: 0 }));
  audio = el;
  return el;
}

/** Lance un titre, ou met en pause / reprend s'il est déjà le titre en cours. */
export function toggleTrack(id: string, url: string) {
  const el = getAudio();
  if (state.id === id) {
    if (el.paused) el.play().catch(() => emit({ playing: false }));
    else el.pause();
    return;
  }
  el.pause();
  el.src = url;
  emit({ id, progress: 0 });
  el.play().catch(() => emit({ playing: false }));
}

export function stopTrack() {
  audio?.pause();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER: State = { id: null, playing: false, progress: 0 };

export function usePlayback() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}
