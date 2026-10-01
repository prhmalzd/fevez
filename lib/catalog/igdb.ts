import type { CatalogItem, CatalogSearchResult } from "@/lib/types";
import { CatalogProviderError, type CatalogProvider } from "./types";

let accessToken: { value: string; expiresAt: number } | null = null;
const cover = (id?: string) => id ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${id}.jpg` : "/placeholder-art.svg";

async function token() {
  if (accessToken && accessToken.expiresAt > Date.now() + 60_000) return accessToken.value;
  const id = process.env.TWITCH_CLIENT_ID;
  const secret = process.env.TWITCH_CLIENT_SECRET;
  if (!id || !secret) throw new CatalogProviderError("IGDB", "IGDB is not configured", 503);
  const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(id)}&client_secret=${encodeURIComponent(secret)}&grant_type=client_credentials`, { method: "POST", cache: "no-store" });
  if (!response.ok) throw new CatalogProviderError("IGDB", "Could not authenticate with IGDB", response.status);
  const data = await response.json() as { access_token: string; expires_in: number };
  accessToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return accessToken.value;
}

async function request<T>(body: string): Promise<T> {
  const id = process.env.TWITCH_CLIENT_ID;
  if (!id) throw new CatalogProviderError("IGDB", "IGDB is not configured", 503);
  const response = await fetch("https://api.igdb.com/v4/games", { method: "POST", headers: { "Client-ID": id, Authorization: `Bearer ${await token()}`, "Content-Type": "text/plain" }, body, next: { revalidate: 60 * 60 * 12 } });
  if (!response.ok) throw new CatalogProviderError("IGDB", `IGDB returned ${response.status}`, response.status);
  return response.json() as Promise<T>;
}

type IgdbGame = { id: number; name: string; first_release_date?: number; summary?: string; rating?: number; cover?: { image_id?: string }; genres?: Array<{ name: string }>; involved_companies?: Array<{ company?: { name?: string }; developer?: boolean }> };

function normalize(item: IgdbGame): CatalogItem {
  const developer = item.involved_companies?.find((company) => company.developer)?.company?.name ?? "Video game";
  return { id: `igdb:${item.id}`, providerId: String(item.id), category: "games", title: item.name, subtitle: developer, year: item.first_release_date ? new Date(item.first_release_date * 1000).getUTCFullYear() : 0, image: cover(item.cover?.image_id), description: item.summary ?? "", metadata: [item.genres?.map((genre) => genre.name).join(", ") ?? "Game"], providerScore: item.rating ? item.rating / 10 : undefined };
}

const fields = "fields name,first_release_date,summary,rating,cover.image_id,genres.name,involved_companies.developer,involved_companies.company.name";
export const igdbProvider: CatalogProvider = {
  category: "games",
  async search(query, page = 1) { const data = await request<IgdbGame[]>(`${fields}; search \"${query.replace(/[\";]/g, "")}\"; limit 20; offset ${(page - 1) * 20};`); return data.map(normalize) satisfies CatalogSearchResult[]; },
  async getDetails(providerId) { const data = await request<IgdbGame[]>(`${fields}; where id = ${Number(providerId)}; limit 1;`); return data[0] ? normalize(data[0]) : null; }
};
