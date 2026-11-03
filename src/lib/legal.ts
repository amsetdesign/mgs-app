import { SITE } from "./site";

// Même esprit que les textes de l'application mobile (lib/legal.ts), complétés pour le site
const contact = `Pour toute question, écrivez-nous à ${SITE.email}.`;

export const CGU = {
  title: "Conditions d'utilisation",
  updated: "3 novembre 2026",
  sections: [
    { title: "Objet", body: `${SITE.name} (MGS) est un média et une plateforme d'écoute dédiés au gospel. Le site présente des artistes, des titres, des événements et des actualités, et permet de soumettre des projets et des événements. En utilisant le site ou l'application, vous acceptez les présentes conditions.` },
    { title: "Soumission de projets et d'événements", body: "La personne qui soumet un projet ou un événement garantit l'exactitude des informations et détenir les droits nécessaires (composition, enregistrement, visuels). Chaque soumission est vérifiée par l'équipe MGS, qui peut la refuser ou la retirer à tout moment, notamment si elle ne respecte pas l'esprit de la plateforme." },
    { title: "Packs payants", body: "Les packs Boost, Premium et Accompagnement sont réglés par Wave ou Orange Money après validation du projet. Leur contenu est décrit sur la page Services. La diffusion démarre à réception du paiement ; un projet refusé avant paiement n'est pas facturé." },
    { title: "Écoute et comptes", body: "L'écoute est gratuite. Les comptes se créent dans l'application avec une adresse e-mail confirmée. Vous pouvez supprimer votre compte à tout moment depuis les Paramètres de l'application." },
    { title: "Contenus interdits", body: "Sont interdits : les contenus haineux, violents, discriminatoires ou contraires à la loi, l'usurpation d'identité et la publication d'œuvres d'autrui sans autorisation." },
    { title: "Droit applicable", body: `Les présentes conditions sont régies par le droit sénégalais. ${contact}` },
  ],
};

export const PRIVACY = {
  title: "Confidentialité",
  updated: "3 novembre 2026",
  sections: [
    { title: "Données collectées", body: "Sur le site : les informations saisies dans les formulaires (nom, téléphone, e-mail, pays, réseaux sociaux, projet, événement, message) et l'adresse e-mail des inscrits à la newsletter. Dans l'application : compte, bibliothèque et historique d'écoute." },
    { title: "Utilisation", body: "Ces données servent uniquement à traiter vos demandes, à publier les projets et événements validés, à vous envoyer la newsletter si vous l'avez demandée, et à produire des statistiques d'écoute. Elles ne sont jamais vendues." },
    { title: "Ce qui est public", body: "Seules les informations des projets et événements validés sont publiées (titre, visuel, description, lieu, et le contact de l'organisateur s'il l'a fourni pour le public). Le téléphone et l'e-mail saisis pour une soumission de projet restent réservés à l'équipe." },
    { title: "Hébergement", body: "Le site est hébergé par Vercel, la base de données par Supabase et les fichiers (sons, images) par Cloudflare. Ces prestataires traitent les données pour notre compte uniquement." },
    { title: "Vos droits", body: `Conformément à la loi sénégalaise n° 2008-12 sur la protection des données à caractère personnel, vous pouvez demander l'accès, la correction ou la suppression de vos données, et vous désinscrire de la newsletter à tout moment. Vous pouvez aussi saisir la Commission de Protection des Données Personnelles (CDP). ${contact}` },
  ],
};
