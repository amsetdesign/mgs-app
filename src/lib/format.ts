const TZ = "Africa/Dakar";

export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, ...opts }).format(new Date(iso));
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function formatPrice(fcfa: number) {
  return fcfa === 0 ? "0 F CFA" : `${new Intl.NumberFormat("fr-FR").format(fcfa)} F CFA`;
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")} M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".0", "")} k`;
  return String(n);
}

export function formatDuration(sec: number) {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Jour calendaire à Dakar (AAAA-MM-JJ), pour comparer des dates d'événements. */
export function dakarDay(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(iso));
}

/** Identifiant YouTube depuis une adresse de vidéo (watch, youtu.be, shorts, embed). */
export function youtubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Instant situé `hours` heures avant maintenant, au format ISO (requêtes « à venir »). */
export function hoursAgoIso(hours: number) {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}

/** Vrai si la date est passée depuis plus de `graceHours` heures. */
export function isPast(iso: string, graceHours = 0) {
  return new Date(iso).getTime() < Date.now() - graceHours * 3600 * 1000;
}

/** Maintenant en millisecondes (hors rendu des composants : règle de pureté React). */
export const nowMs = () => Date.now();

/** Date du jour au format AAAA-MM-JJ. */
export const todayIso = () => new Date().toISOString().slice(0, 10);

/** Date du jour en toutes lettres, heure de Dakar (bandeau de la une). */
export const todayLong = () => formatDate(new Date().toISOString(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
