# Jaures Art — Portfolio

Site portfolio d'artiste (Next.js + Strapi), bilingue FR/EN.

## Structure

```
backend/    Strapi 5 (CMS headless, SQLite en dev)
frontend/   Next.js 16 (App Router, Tailwind v4)
```

## Démarrer le projet

### Backend (Strapi)

```bash
cd backend
npm run develop
```

- Admin panel : http://localhost:1337/admin
- API publique : http://localhost:1337/api

**Compte admin créé :**
- Email : `sarbaabdoulsacourou@gmail.com`
- Mot de passe : `JauresArt2026!` (à changer depuis le profil admin après la première connexion)

### Frontend (Next.js)

```bash
cd frontend
npm run dev
```

- Site : http://localhost:3000 (redirige vers `/fr`)

`.env.local` contient `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`.

## Contenu de démonstration

Un jeu de données de démo (7 séries, 12 œuvres, profil artiste complet, 2 citations,
3 expositions, page + sections, réglages du site) a été inséré en FR et EN via :

```bash
cd backend
node scripts/seed.js
```

Ce script est idempotent uniquement dans le sens où il **crée** de nouvelles entrées à
chaque exécution — ne le relancez pas sans vider `backend/.tmp/data.db` au préalable,
sous peine de dupliquer les données.

## Modèle de contenu

Collections : `Page`, `Section`, `SectionItem` (relie une Section à une Artwork,
Exhibition ou Quote — non listé explicitement dans le brief d'origine mais nécessaire
pour implémenter `Section.items → SectionItem`), `Artwork`, `Series`, `Quote`,
`Exhibition`, `ContactMessage`.
Singletons : `ArtistProfile`, `Settings`.
Composants : `bio.stat`, `bio.highlight`.

**Note sur `Series`** : Strapi exige que `singularName` et `pluralName` soient
distincts. Pour garder l'endpoint REST `/api/series` (pluriel naturel), le
`singularName` interne a été fixé à `serie` (UID `api::series.serie`). Cela n'affecte
que du code interne, jamais l'API publique.

## i18n

Le plugin i18n de Strapi est actif avec deux locales : `fr` (locale par défaut) et
`en`. Le contenu localisé est géré via `bootstrap()` dans `backend/src/index.ts`.

## Permissions

Le rôle **Public** (plugin Users & Permissions) est configuré automatiquement au
démarrage (`ensurePublicPermissions` dans `backend/src/index.ts`) :
lecture (`find`/`findOne`) sur toutes les collections de contenu, et création
(`create`) uniquement sur `ContactMessage`.

**Rôles Admin (Editor / Viewer) — configuration manuelle requise.**
Strapi ne permet pas de définir les rôles du panneau d'administration par fichier de
schéma : ces permissions sont enregistrées en base après le premier démarrage et se
configurent via l'interface. Depuis `Settings → Administration panel → Roles` :

1. Créer le rôle **Editor** : cocher Create/Read/Update/Delete/Publish sur `Artwork`,
   `Series`, `Exhibition`, `Quote`, `ArtistProfile`, `Page`, `Section`,
   `SectionItem` — **ne pas** cocher `Settings`.
2. Créer le rôle **Viewer** : cocher uniquement Read sur toutes les collections.
3. Le rôle **Super Admin** (compte créé ci-dessus) a déjà accès complet.

## Design frontend

Direction éditoriale « galerie d'art » : typographie serif (Cormorant Garamond) pour
les titres, sans-serif (Karla) pour le corps de texte, palette claire (Cloud White,
bleu tendre, lilas) définie dans `frontend/src/app/globals.css`.

## Docker

Le projet est entièrement conteneurisé : `backend/Dockerfile`, `frontend/Dockerfile`
et `docker-compose.yml` à la racine.

```bash
docker compose up -d --build
```

- Backend : http://localhost:1337
- Frontend : http://localhost:3002 (le port 3000 hôte est laissé libre pour d'autres
  projets ; changez le mapping `3002:3000` dans `docker-compose.yml` si besoin)

Au premier démarrage, la base SQLite du conteneur est vide (volume Docker nommé
`strapi-data`, distinct de `backend/.tmp/data.db` utilisé en dev local). Il faut créer
un admin et semer le contenu :

```bash
docker compose exec backend npx strapi admin:create-user \
  --email "vous@example.com" --password "VotreMotDePasse1!" \
  --firstname "Prénom" --lastname "Nom"

docker compose exec backend node scripts/seed.js
```

**Point d'architecture important** — le frontend distingue deux URLs vers Strapi :
- `STRAPI_INTERNAL_URL` (`http://backend:1337`) : utilisée pour **tout ce qui
  s'exécute côté serveur** — Server Components (SSR) et surtout l'optimiseur
  d'images de `next/image`, qui va lui-même chercher les fichiers via son endpoint
  `/_next/image` (le navigateur ne contacte jamais Strapi directement pour les
  images). C'est aussi pour ça que `backend` doit figurer dans
  `images.remotePatterns` de `next.config.ts`.
- `NEXT_PUBLIC_STRAPI_URL` (`http://localhost:1337` par défaut) : utilisée
  uniquement par le code qui s'exécute réellement dans le navigateur (le formulaire
  de contact qui ouvre WhatsApp). Doit rester une URL réellement joignable depuis
  la machine du visiteur, jamais un nom de service Docker. Elle est figée dans le
  bundle client **au moment du build** (`docker compose build`), donc toute
  modification nécessite un rebuild de l'image frontend.

Les pages sont rendues dynamiquement (`export const dynamic = "force-dynamic"` dans
`app/[locale]/layout.tsx`) plutôt que pré-générées au build, pour que la construction
de l'image frontend n'exige pas que le backend tourne pendant `docker build`.

Volumes persistants : `strapi-data` (base SQLite) et `strapi-uploads` (médias). Pour
repartir de zéro : `docker compose down -v`.

## Production (VPS, HTTPS via Traefik existant)

Si le serveur a déjà un reverse proxy Traefik (fourni avec un `certresolver`
Let's Encrypt nommé `letsencrypt` et l'entrypoint `websecure`), les services
portent déjà les labels `traefik.*` nécessaires. Il suffit de renseigner un
`.env` à la racine :

```bash
FRONTEND_DOMAIN=mondomaine.example
BACKEND_DOMAIN=api.mondomaine.example
NEXT_PUBLIC_STRAPI_URL=https://api.mondomaine.example
```

puis de lancer avec la surcouche production, qui rend les ports directs
injoignables publiquement (Traefik atteint chaque conteneur via le réseau
Docker interne, pas via ces ports) :

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Le certificat est émis automatiquement au premier accès HTTPS (défi HTTP-01,
donc `FRONTEND_DOMAIN`/`BACKEND_DOMAIN` doivent déjà pointer vers le serveur
en DNS avant de démarrer).
