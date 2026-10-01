import type { CatalogItem, CatalogSearchResult } from "@/lib/types";
import { CatalogProviderError, type CatalogProvider } from "./types";

const api = "https://api.themoviedb.org/3";
const imageUrl = (path?: string | null) => path ? `https://image.tmdb.org/t/p/w500${path}` : "/placeholder-art.svg";

async function request<T>(path: string): Promise<T> {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) throw new CatalogProviderError("TMDB", "TMDB is not configured", 503);
  const response = await fetch(`${api}${path}`, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 * 60 * 12 } });
  if (!response.ok) throw new CatalogProviderError("TMDB", `TMDB returned ${response.status}`, response.status);
  return response.json() as Promise<T>;
}

export const tmdbProvider: CatalogProvider = {
  category: "movies",
  async search(query, page = 1) {
    const data = await request<{ results: Array<{ id: number; title: string; release_date?: string; poster_path?: string; original_language?: string }> }>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`);
    return data.results.map((item): CatalogSearchResult => ({ providerId: String(item.id), category: "movies", title: item.title, subtitle: item.original_language?.toUpperCase() ?? "Movie", year: Number(item.release_date?.slice(0, 4)) || 0, image: imageUrl(item.poster_path) }));
  },
  async getDetails(providerId) {
    const item = await request<{ id: number; title: string; release_date?: string; poster_path?: string; backdrop_path?: string; overview?: string; runtime?: number; vote_average?: number; genres?: Array<{ name: string }>; production_countries?: Array<{ name: string }> }>(`/movie/${encodeURIComponent(providerId)}`);
    return { id: `tmdb:${item.id}`, providerId: String(item.id), category: "movies", title: item.title, subtitle: item.genres?.[0]?.name ?? "Movie", year: Number(item.release_date?.slice(0, 4)) || 0, image: imageUrl(item.poster_path), backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : undefined, description: item.overview ?? "", metadata: [item.genres?.map((genre) => genre.name).join(", ") ?? "Movie", item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : "", item.production_countries?.[0]?.name ?? ""].filter(Boolean), providerScore: item.vote_average } satisfies CatalogItem;
  }
};
