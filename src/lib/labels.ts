export const ARTICLE_CATEGORIES = {
  news: "Actualités",
  interview: "Interviews",
  sortie: "Sorties",
  temoignage: "Témoignages",
  evenement: "Événements",
  culture: "Culture chrétienne",
} as const;
export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES;

export const EVENT_CATEGORIES = {
  concert: "Concert",
  festival: "Festival",
  showcase: "Showcase",
  veillee: "Veillée",
  conference: "Conférence",
  culte: "Culte de louange",
  autre: "Autre",
} as const;
export type EventCategory = keyof typeof EVENT_CATEGORIES;

export const PROJECT_TYPES = {
  single: "Single",
  clip: "Clip",
  ep: "EP",
  album: "Album",
  mixtape: "Mixtape",
  concert: "Concert",
  showcase: "Showcase",
  festival: "Festival",
  teaser: "Teaser",
  communique: "Communiqué",
} as const;
export type ProjectType = keyof typeof PROJECT_TYPES;

export const SUBMISSION_STATUS = {
  recu: "Reçu",
  paye: "Payé",
  en_cours: "En cours",
  publie: "Publié",
  refuse: "Refusé",
} as const;
export type SubmissionStatus = keyof typeof SUBMISSION_STATUS;
