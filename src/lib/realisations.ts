import { GGU, GGU3, SUNU_IMPACT } from "./photos";

// Événements portés ou accompagnés par MGS (faits fournis par l'équipe MGS)
export type Realisation = {
  title: string;
  role: string; // ce que MGS a fait
  date: string;
  place: string;
  summary: string;
  image?: { src: string; alt: string; w: number; h: number; poster?: boolean }; // jamais de photo d'un autre événement
  href?: string;
  external?: string;
};

export const REALISATIONS: Realisation[] = [
  {
    title: "Galsen Gospel Urbain 3",
    role: "Organisation",
    date: "Décembre 2025",
    place: "Dakar",
    summary: "La 3e édition du festival du gospel urbain : le GGU Chill et le grand concert.",
    image: GGU3.sceneVerte,
    href: "/galsen-gospel-urbain",
  },
  {
    title: "Concert GAD 2024",
    role: "Communication",
    date: "30 novembre 2024",
    place: "Grand Théâtre National, Dakar",
    summary:
      "Concert de MH Prod d'Évangélisation avec KS Bloom, Anne Elisabeth, José Mayélé, Cantar para Jesucristo et Yeta Sarr, en faveur des enfants atteints d'AVC et de drépanocytose.",
    image: { src: "/photos/realisations/concert-gad-2024.webp", alt: "Affiche du Concert GAD 2024 au Grand Théâtre National de Dakar", w: 1000, h: 1282, poster: true },
  },
  {
    title: SUNU_IMPACT.name,
    role: "Organisation",
    date: "",
    place: "Sénégal",
    summary: `Festival organisé en partenariat avec l'${SUNU_IMPACT.partner}.`,
    external: SUNU_IMPACT.instagram,
  },
];

export { GGU };
