// Photos réelles des événements organisés par MGS (Drive officiel MGS, sélection et allègement pour le web)
export type Photo = { src: string; alt: string; w: number; h: number };

const p = (name: string, alt: string, w: number, h: number): Photo => ({ src: `/photos/ggu3/${name}.webp`, alt, w, h });

export const GGU3 = {
  heroStage: p("bellus-scene", "Bellus sur la scène du Galsen Gospel Urbain 3", 1536, 1024),
  louange: p("concert-louange", "Le public en louange pendant le grand concert du GGU 3", 1600, 1066),
  publicConcert: p("concert-public", "Le public du grand concert du Galsen Gospel Urbain 3", 1600, 1066),
  sceneBleue: p("concert-scene-bleue", "Un artiste sur la scène du grand concert du GGU 3", 1067, 1600),
  artiste1: p("concert-artiste-1", "Une artiste au micro pendant le grand concert du GGU 3", 1067, 1600),
  artiste2: p("concert-artiste-2", "Une artiste chante pendant le grand concert du GGU 3", 1600, 1066),
  artiste3: p("concert-artiste-3", "Un artiste sur la scène du grand concert du GGU 3", 1600, 1066),
  groupe: p("concert-groupe", "Un groupe sur la scène du grand concert du GGU 3", 1600, 1066),
  collectif: p("concert-collectif", "Plusieurs artistes réunis sur scène au GGU 3", 1600, 1066),
  bellusPortrait: p("bellus-portrait", "Bellus au Galsen Gospel Urbain 3", 1536, 1024),
  jaria: p("jaria-scene", "Jaria sur la scène du Galsen Gospel Urbain 3", 1024, 1536),
  auricia: p("auricia-chill", "Auricia au GGU Chill", 1536, 1024),
  jerryBorel: p("jerry-borel-chill", "Jerry Borel au GGU Chill", 1536, 1024),
  lhebreux: p("lhebreux-chill", "L'Hébreux au GGU Chill", 1536, 1024),
  laPlume: p("la-plume-chill", "La Plume au GGU Chill", 1024, 1536),
  rapStar: p("rap-star-chill", "Rap Star au GGU Chill", 896, 1152),
  johnDarc: p("john-darc-guitare", "John d'Arc à la guitare au GGU Chill", 1024, 1536),
  chillScene1: p("chill-scene-1", "La scène du GGU Chill", 1024, 683),
  chillScene2: p("chill-scene-2", "Les artistes réunis sur la scène du GGU Chill", 1248, 832),
  chillPublic: p("chill-public", "Le public du GGU Chill", 1248, 832),
  chillAssistance: p("chill-assistance", "L'assistance du GGU Chill", 1600, 1066),
  // sélection choisie par l'équipe MGS (meilleurs plans)
  sceneVerte: p("concert-scene-verte", "Les artistes réunis sur la scène du grand concert du GGU 3", 1800, 1200),
  collectifMicros: p("concert-collectif-micros", "Quatre artistes au micro pendant le grand concert du GGU 3", 1800, 1200),
  denim: p("concert-denim", "Une artiste sur scène dans la fumée violette du grand concert", 1200, 1800),
  casquette: p("concert-casquette", "Un artiste chante sous les lumières du grand concert du GGU 3", 1200, 1800),
  costume: p("concert-costume", "Un rappeur au micro sur la scène du GGU 3", 1200, 1800),
  vesteRouge: p("concert-veste-rouge", "Une artiste en veste rouge sur la scène du GGU 3", 1024, 1536),
  vainqueur: p("concert-vainqueur", "Remise du prix « Grand vainqueur » sur la scène du GGU 3", 1200, 1800),
  guitare: p("chill-guitare", "Un chanteur à la guitare au GGU Chill", 1024, 1536),
  rappeur: p("chill-rappeur", "Un rappeur au GGU Chill", 1536, 1024),
};

export const GGU = {
  name: "Galsen Gospel Urbain",
  short: "GGU",
  clip: "YvtkEgJyEwk",
  site: "https://galsengospelurbain.com",
  instagram: "https://www.instagram.com/galsen_gospel_urbain/",
  tiktok: "https://www.tiktok.com/@galsen.gospel.urbain",
};

export const SUNU_IMPACT = {
  name: "Sunu Impact Festival",
  partner: "ONG Chaque Maison du Monde Sénégal",
  instagram: "https://www.instagram.com/sunu_impactfestival/",
  site: "https://sunuimpactfestival.com",
};

// Affiches officielles des événements MGS
const a = (name: string, alt: string, w: number, h: number): Photo => ({ src: `/photos/affiches/${name}.webp`, alt, w, h });
export const POSTERS = {
  ggu3: a("ggu3", "Affiche du Galsen Gospel Urbain 3, du 26 au 28 décembre 2025 au Centre culturel Blaise Senghor", 512, 640),
  ggu3Chill: a("ggu3-chill", "Affiche du GGU Chill, vendredi 26 décembre au Centre culturel Blaise Senghor", 1000, 1250),
  sunu2025: a("sunu-impact-2025", "Affiche du Sunu Impact Festival 2025 « Brille par ton talent », du 26 au 29 juin 2025", 864, 1080),
  sunu2025Concert: a("sunu-impact-2025-concert", "Affiche du concert de célébration du Sunu Impact Festival, 29 juin 2025", 864, 1080),
};
