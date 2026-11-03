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
};

export const GGU = {
  name: "Galsen Gospel Urbain",
  short: "GGU",
  clip: "YvtkEgJyEwk",
  instagram: "https://www.instagram.com/galsen_gospel_urbain/",
  tiktok: "https://www.tiktok.com/@galsen.gospel.urbain",
};

export const SUNU_IMPACT = {
  name: "Sunu Impact Festival",
  partner: "ONG CMM Sénégal",
  instagram: "https://www.instagram.com/sunu_impactfestival/",
};
