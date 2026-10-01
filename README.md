# Fevez

Fevez is a warm, minimal social home for the movies, albums and games people love. The app runs with rich demo data out of the box and switches its authentication/catalog integrations on when environment variables are present.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Useful demo routes include `/home`, `/explore`, `/u/noahframes`, and `/item/movies/157336`.

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/202609300001_initial_schema.sql`, then optionally `supabase/seed.sql`.
3. Copy `.env.example` to `.env.local` and provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Enable the Email provider in Supabase Auth. If email confirmation is enabled, add `http://localhost:3000/auth/callback` plus the production callback URL to the redirect allow-list.

The migration provides profiles, ordered category settings, catalog snapshots, Top 25 ratings, follows, activities, likes, constraints, triggers, storage policies, and row-level security.

## Catalog providers

- Movies: set `TMDB_API_TOKEN`.
- Albums: set `MUSICBRAINZ_CONTACT` to a real project contact. MusicBrainz calls are throttled to one request per second.
- Games: set `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET` for IGDB.

All provider requests run through server code. `/api/catalog/search?category=movies&q=arrival` returns live results when configured and falls back to matching demo snapshots when a provider is unavailable.

## Verification

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

Deploy to Vercel by importing the repository and adding the same environment variables. No platform-specific build configuration is required.
