import type { CatalogItem, CatalogSearchResult } from "@/lib/types";
import { CatalogProviderError, type CatalogProvider } from "./types";

const base = "https://musicbrainz.org/ws/2";
const art = (id: string) => `https://coverartarchive.org/release-group/${id}/front-500`;
let lastRequestAt = 0;

async function request<T>(path: string): Promise<T> {
  const wait = Math.max(0, 1000 - (Date.now() - lastRequestAt));
  if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
  lastRequestAt = Date.now();
  const contact = process.env.MUSICBRAINZ_CONTACT ?? "hello@fevez.app";
  const response = await fetch(`${base}${path}`, { headers: { "User-Agent": `Fevez/0.1 (${contact})`, Accept: "application/json" }, next: { revalidate: 60 * 60 * 24 * 7 } });
  if (!response.ok) throw new CatalogProviderError("MusicBrainz", `MusicBrainz returned ${response.status}`, response.status);
  return response.json() as Promise<T>;
}

type ReleaseGroup = { id: string; title: string; "first-release-date"?: string; "primary-type"?: string; "artist-credit"?: Array<{ name: string }>; tags?: Array<{ name: string }> };

export const musicBrainzProvider: CatalogProvider = {
  category: "music",
  async search(query, page = 1) {
    const offset = (page - 1) * 20;
    const data = await request<{ "release-groups": ReleaseGroup[] }>(`/release-group?query=${encodeURIComponent(`releasegroup:${query} AND primarytype:album`)}&limit=20&offset=${offset}&fmt=json`);
    return data["release-groups"].map((item): CatalogSearchResult => ({ providerId: item.id, category: "music", title: item.title, subtitle: item["artist-credit"]?.map((artist) => artist.name).join(", ") ?? "Unknown artist", year: Number(item["first-release-date"]?.slice(0, 4)) || 0, image: art(item.id) }));
  },
  async getDetails(providerId) {
    const item = await request<ReleaseGroup>(`/release-group/${encodeURIComponent(providerId)}?inc=artists+tags&fmt=json`);
    return { id: `musicbrainz:${item.id}`, providerId: item.id, category: "music", title: item.title, subtitle: item["artist-credit"]?.map((artist) => artist.name).join(", ") ?? "Unknown artist", year: Number(item["first-release-date"]?.slice(0, 4)) || 0, image: art(item.id), description: `${item.title} by ${item["artist-credit"]?.[0]?.name ?? "Unknown artist"}.`, metadata: [item["primary-type"] ?? "Album", ...(item.tags?.slice(0, 2).map((tag) => tag.name) ?? [])] } satisfies CatalogItem;
  }
};
