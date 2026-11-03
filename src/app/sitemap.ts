import type { MetadataRoute } from "next";
import { getArticles, getArtists, getUpcomingEvents } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [artists, articles, events] = await Promise.all([getArtists(), getArticles({ limit: 1000 }), getUpcomingEvents({ limit: 500 })]);
  const pages = ["", "/artistes", "/actualites", "/evenements", "/services", "/soumettre", "/evenements/soumettre", "/a-propos", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...artists.map((a) => ({ url: `${SITE.url}/artistes/${a.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...articles.map((a) => ({ url: `${SITE.url}/actualites/${a.slug}`, lastModified: a.published_at, priority: 0.7 })),
    ...events.map((e) => ({ url: `${SITE.url}/evenements/${e.slug}`, priority: 0.6 })),
  ];
}
