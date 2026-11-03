# Site officiel Music Gospel Sénégal

Next.js 16 (App Router) + Tailwind 4, branché sur la même base Supabase que l'application mobile
(dépôt Music-Gospel-Senegal-Mobilapp, migrations dans `supabase/migrations`).

- Pages publiques : accueil, artistes, actualités, événements (calendrier + annonce), services et packs,
  soumission de projet, à propos, contact, pages légales, sitemap.
- Administration (`/admin`) : réservée aux comptes dont le profil a le rôle `admin`.
- Images des formulaires : envoyées sur Cloudflare R2 par le serveur (clés dans les variables d'environnement).

Démarrage : copier `.env.example` en `.env.local`, le remplir, puis `npm install` et `npm run dev`.
