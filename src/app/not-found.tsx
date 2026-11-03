import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteNotFound from "./(site)/not-found";

// Adresse inconnue hors des pages du site : même 404, avec en-tête et pied de page
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu"><SiteNotFound /></main>
      <Footer />
    </>
  );
}
