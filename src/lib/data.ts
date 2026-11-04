import "server-only";
import { publicClient } from "@/lib/supabase/public";
import { hasSupabase } from "@/lib/supabase/env";
import type { ArticleCategory, EventCategory } from "@/lib/labels";

export type ArtistProfile = { full_name: string; avatar_url: string; country: string; bio: string };

export type Artist = {
  id: string;
  slug: string;
  bio: string;
  verified: boolean;
  featured: boolean;
  followers_count: number;
  streams_count: number;
  social_instagram: string;
  social_facebook: string;
  social_youtube: string;
  social_tiktok: string;
  profiles: ArtistProfile | null;
};

export type Song = {
  id: string;
  title: string;
  audio_url: string;
  cover_url: string;
  genre: string;
  duration: number;
  streams_count: number;
  created_at: string;
  artist_id: string;
  artists: { slug: string; profiles: { full_name: string } | null } | null;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string;
  category: ArticleCategory;
  published_at: string;
  artist_id: string | null;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  category: EventCategory;
  city: string;
  country: string;
  venue: string;
  starts_at: string;
  ends_at: string | null;
  description: string;
  poster_url: string;
  contact_phone: string;
  contact_email: string;
  ticket_url: string;
  artist_id: string | null;
};

const ARTIST_FIELDS =
  "id, slug, bio, verified, featured, followers_count, streams_count, social_instagram, social_facebook, social_youtube, social_tiktok, profiles(full_name, avatar_url, country, bio)";
const SONG_FIELDS = "id, title, audio_url, cover_url, genre, duration, streams_count, created_at, artist_id, artists(slug, profiles(full_name))";

/** Un titre n'est écoutable que s'il pointe vers un vrai fichier audio (pas les anciens liens Audiomack). */
export const isPlayable = (s: Pick<Song, "audio_url">) => /^https?:\/\//.test(s.audio_url) && !s.audio_url.includes("audiomack.com");

export const artistName = (a: { profiles: { full_name: string } | null } | null | undefined) => a?.profiles?.full_name || "Artiste";

// Sans base configurée (préparation locale), le site s'affiche avec des listes vides
async function safe<T>(fallback: T, run: () => Promise<T>): Promise<T> {
  if (!hasSupabase) return fallback;
  try {
    return await run();
  } catch {
    return fallback;
  }
}

// ===== Artistes =====
type ArtistWithSongs = Artist & { songs: { audio_url: string }[] };

export function getArtists(): Promise<(Artist & { songCount: number })[]> {
  return safe([], async () => {
    // seuls les titres réellement écoutables sont comptés (RLS : titres publiés uniquement)
    const { data } = await publicClient().from("artists").select(`${ARTIST_FIELDS}, songs(audio_url)`).order("featured", { ascending: false }).order("streams_count", { ascending: false });
    return ((data ?? []) as unknown as ArtistWithSongs[]).map(({ songs, ...a }) => ({ ...a, songCount: (songs ?? []).filter(isPlayable).length }));
  });
}

/** À la une : artistes mis en avant par l'équipe, puis ceux qui ont des titres publiés. */
export async function getFeaturedArtists(limit = 8) {
  const all = await getArtists();
  return all
    .filter((a) => a.featured || a.songCount > 0)
    .sort((x, y) => Number(y.songCount > 0) - Number(x.songCount > 0))
    .slice(0, limit);
}

export function getArtist(slug: string) {
  return safe(null, async () => {
    const { data } = await publicClient().from("artists").select(ARTIST_FIELDS).eq("slug", slug).maybeSingle();
    return (data as unknown as Artist | null) ?? null;
  });
}

// ===== Titres =====
export function getLatestSongs(limit = 8) {
  return safe([], async () => {
    const { data } = await publicClient().from("songs").select(SONG_FIELDS).eq("is_published", true).eq("kind", "musique").order("created_at", { ascending: false }).limit(limit);
    return ((data ?? []) as unknown as Song[]).filter(isPlayable);
  });
}

export function getArtistSongs(artistId: string) {
  return safe([], async () => {
    const { data } = await publicClient().from("songs").select(SONG_FIELDS).eq("artist_id", artistId).eq("is_published", true).order("created_at", { ascending: false });
    return ((data ?? []) as unknown as Song[]).filter(isPlayable);
  });
}

/** Top de la semaine : classement calculé par la base sur les écoutes réelles (30 s minimum). */
export function getTopWeek(limit = 5) {
  return safe([], async () => {
    const supabase = publicClient();
    const { data: ranking } = await supabase.rpc("top_songs_week", { p_limit: limit });
    const rows = (ranking ?? []) as { song_id: string; plays: number }[];
    if (rows.length === 0) return [];
    const { data } = await supabase.from("songs").select(SONG_FIELDS).in("id", rows.map((r) => r.song_id));
    const byId = new Map(((data ?? []) as unknown as Song[]).map((s) => [s.id, s]));
    return rows.flatMap((r) => {
      const song = byId.get(r.song_id);
      return song && isPlayable(song) ? [{ ...song, plays: Number(r.plays) }] : [];
    });
  });
}

// ===== Articles =====
const ARTICLE_FIELDS = "id, slug, title, excerpt, body, cover_url, category, published_at, artist_id";

export function getArticles({ category, limit = 24, artistId }: { category?: ArticleCategory; limit?: number; artistId?: string } = {}) {
  return safe([], async () => {
    let q = publicClient().from("articles").select(ARTICLE_FIELDS).order("published_at", { ascending: false }).limit(limit);
    if (category) q = q.eq("category", category);
    if (artistId) q = q.eq("artist_id", artistId);
    const { data } = await q;
    return (data ?? []) as Article[];
  });
}

export function getArticle(slug: string) {
  return safe(null, async () => {
    const { data } = await publicClient().from("articles").select(ARTICLE_FIELDS).eq("slug", slug).maybeSingle();
    return (data as Article | null) ?? null;
  });
}

// ===== Événements =====
const EVENT_FIELDS =
  "id, slug, title, organizer, category, city, country, venue, starts_at, ends_at, description, poster_url, contact_phone, contact_email, ticket_url, artist_id";

export function getUpcomingEvents({ limit = 60, city, category, artistId }: { limit?: number; city?: string; category?: EventCategory; artistId?: string } = {}) {
  return safe([], async () => {
    // un événement reste affiché jusqu'à la fin de sa journée
    const since = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
    let q = publicClient().from("events").select(EVENT_FIELDS).gte("starts_at", since).order("starts_at").limit(limit);
    if (city) q = q.ilike("city", city);
    if (category) q = q.eq("category", category);
    if (artistId) q = q.eq("artist_id", artistId);
    const { data } = await q;
    return (data ?? []) as EventItem[];
  });
}

export function getEventCities() {
  return safe([], async () => {
    const { data } = await publicClient().from("events").select("city").gte("starts_at", new Date().toISOString()).limit(500);
    return [...new Set(((data ?? []) as { city: string }[]).map((e) => e.city.trim()))].sort((a, b) => a.localeCompare(b, "fr"));
  });
}

export function getEvent(slug: string) {
  return safe(null, async () => {
    const { data } = await publicClient().from("events").select(EVENT_FIELDS).eq("slug", slug).maybeSingle();
    return (data as EventItem | null) ?? null;
  });
}

/** Événements validés le même jour (heure de Dakar) : sert à prévenir les chevauchements. */
export function getEventsOnDay(day: string) {
  return safe([], async () => {
    const start = new Date(`${day}T00:00:00Z`);
    const from = new Date(start.getTime() - 3600 * 1000 * 2).toISOString();
    const to = new Date(start.getTime() + 3600 * 1000 * 26).toISOString();
    const { data } = await publicClient().from("events").select("title, city, organizer, starts_at").gte("starts_at", from).lte("starts_at", to).order("starts_at");
    return ((data ?? []) as Pick<EventItem, "title" | "city" | "organizer" | "starts_at">[]).filter(
      (e) => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Dakar" }).format(new Date(e.starts_at)) === day,
    );
  });
}

// ===== Sélection MGS et mises en avant =====
export function getSelection(limit = 6) {
  return safe([], async () => {
    const { data } = await publicClient().from("songs").select(SONG_FIELDS).eq("is_published", true).not("featured_at", "is", null).order("featured_at", { ascending: false }).limit(limit);
    return ((data ?? []) as unknown as Song[]).filter(isPlayable);
  });
}

export type Promotion = {
  id: string;
  kind: "banner" | "song" | "artist" | "event";
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  sponsored: boolean;
  songs: { id: string; title: string; cover_url: string; artists: { slug: string } | null } | null;
  artists: { slug: string; profiles: { full_name: string; avatar_url: string } | null } | null;
  events: { slug: string; title: string; poster_url: string } | null;
};

/** Mises en avant en cours pour le site (la base ne renvoie que celles actives et dans leurs dates). */
export function getLivePromotions(limit = 3) {
  return safe([], async () => {
    const { data } = await publicClient()
      .from("promotions")
      .select("id, kind, title, subtitle, image_url, link_url, sponsored, songs(id, title, cover_url, artists(slug)), artists(slug, profiles(full_name, avatar_url)), events(slug, title, poster_url)")
      .in("placement", ["site", "both"])
      .order("starts_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as unknown as Promotion[];
  });
}

/** Image et lien effectifs d'une mise en avant (repli sur le titre, l'artiste ou l'événement ciblé). */
export function promotionTarget(p: Promotion) {
  if (p.kind === "song" && p.songs) return { image: p.image_url || p.songs.cover_url, href: p.songs.artists ? `/artistes/${p.songs.artists.slug}` : "/" };
  if (p.kind === "artist" && p.artists) return { image: p.image_url || p.artists.profiles?.avatar_url || "", href: `/artistes/${p.artists.slug}` };
  if (p.kind === "event" && p.events) return { image: p.image_url || p.events.poster_url, href: `/evenements/${p.events.slug}` };
  return { image: p.image_url, href: p.link_url || "/" };
}

// ===== Page d'un titre (liens de partage) =====
export type SongDetail = Song & { lyrics: string; album_id: string | null; artists: { slug: string; profiles: { full_name: string; avatar_url: string } | null } | null };

export function getSong(id: string) {
  return safe(null, async () => {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
    const { data } = await publicClient()
      .from("songs")
      .select("id, title, audio_url, cover_url, genre, duration, streams_count, created_at, artist_id, lyrics, album_id, artists(slug, profiles(full_name, avatar_url))")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    const song = data as unknown as SongDetail | null;
    return song && isPlayable(song) ? song : null;
  });
}

/** Événements validés d'une année (heure de Dakar), pour le calendrier annuel. */
export function getEventsOfYear(year: number) {
  return safe([], async () => {
    const { data } = await publicClient()
      .from("events")
      .select("slug, title, city, starts_at, category")
      .gte("starts_at", `${year}-01-01T00:00:00Z`)
      .lt("starts_at", `${year + 1}-01-01T00:00:00Z`)
      .order("starts_at")
      .limit(1000);
    return (data ?? []) as Pick<EventItem, "slug" | "title" | "city" | "starts_at" | "category">[];
  });
}
