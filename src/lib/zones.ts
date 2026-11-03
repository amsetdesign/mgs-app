import { slugify } from "./format";

// Catégories artistes du cahier des charges : Sénégal, Afrique, monde francophone, international
const AFRICA = ["afrique du sud", "algerie", "angola", "benin", "botswana", "burkina faso", "burundi", "cameroun", "cap-vert", "centrafrique", "comores", "congo", "rdc", "republique democratique du congo", "cote d'ivoire", "djibouti", "egypte", "erythree", "ethiopie", "gabon", "gambie", "ghana", "guinee", "guinee-bissau", "guinee equatoriale", "kenya", "lesotho", "liberia", "libye", "madagascar", "malawi", "mali", "maroc", "maurice", "mauritanie", "mozambique", "namibie", "niger", "nigeria", "ouganda", "rwanda", "sao tome-et-principe", "seychelles", "sierra leone", "somalie", "soudan", "tanzanie", "tchad", "togo", "tunisie", "zambie", "zimbabwe"].map(slugify);
const FRANCOPHONE = ["france", "belgique", "suisse", "canada", "quebec", "luxembourg", "monaco", "haiti", "guadeloupe", "martinique", "guyane", "reunion", "mayotte", "nouvelle-caledonie", "polynesie francaise"].map(slugify);

export const ZONES = {
  senegal: "Sénégal",
  afrique: "Afrique",
  francophonie: "Francophonie",
  international: "International",
} as const;
export type Zone = keyof typeof ZONES;

export function zoneOf(country: string | null | undefined): Zone {
  const c = slugify(country ?? "");
  if (!c || c.includes("senegal")) return "senegal";
  if (AFRICA.includes(c)) return "afrique";
  if (FRANCOPHONE.includes(c)) return "francophonie";
  return "international";
}
