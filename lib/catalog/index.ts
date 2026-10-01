import type { Category } from "@/lib/types";
import { igdbProvider } from "./igdb";
import { musicBrainzProvider } from "./musicbrainz";
import { tmdbProvider } from "./tmdb";

export const catalogProviders = { movies: tmdbProvider, music: musicBrainzProvider, games: igdbProvider } satisfies Record<Category, typeof tmdbProvider>;
export * from "./types";
