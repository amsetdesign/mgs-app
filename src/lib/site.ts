// Coordonnées et liens officiels de MGS (les champs vides sont masqués sur le site)
export const SITE = {
  name: "Music Gospel Sénégal",
  short: "MGS",
  tagline: "La voix du gospel au Sénégal",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.musicgospelsenegal.com").replace(/\/$/, ""),
  email: "musicgospelsenegal@gmail.com",
  whatsapp: "221781672819", // format international sans +
  phone: "+221 78 167 28 19",
  city: "Dakar, Sénégal",
  socials: {
    facebook: "https://www.facebook.com/musicgospelsenegal",
    instagram: "https://www.instagram.com/musicgospel_senegal/",
    tiktok: "https://www.tiktok.com/@music.gospel.senegal",
    youtube: "https://www.youtube.com/@musicgospelsenegal",
  },
  // Liens des stores dès la publication de l'application
  appStore: "",
  playStore: "",
  // Paiement des packs (Wave / Orange Money), à renseigner avant la mise en ligne
  payment: { wave: "+221 78 167 28 19", orangeMoney: "+221 78 167 28 19", holder: "ASSOU MENSA MAWUGNON SETH" },
};

export const PACKS = [
  {
    id: "gratuit",
    name: "Gratuit",
    price: 0,
    summary: "Votre projet présenté sur le site",
    features: ["Publication simple sur le site", "Vérification par l'équipe MGS"],
  },
  {
    id: "boost",
    name: "Boost",
    price: 15000,
    summary: "Un coup de projecteur sur nos réseaux",
    features: ["Publication sponsorisée", "Story Instagram et Facebook", "Teaser court"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 30000,
    summary: "Une visibilité renforcée partout",
    features: ["Sponsorisation", "Article sur le site", "Diffusion multi-plateforme", "Mise en avant renforcée"],
  },
  {
    id: "accompagnement",
    name: "Accompagnement",
    price: 50000,
    summary: "MGS vous suit de A à Z",
    features: ["Interview", "Teaser vidéo", "Séance photo", "Passage en émission", "Conseil stratégique", "Couverture de l'événement"],
  },
] as const;

export type PackId = (typeof PACKS)[number]["id"];
