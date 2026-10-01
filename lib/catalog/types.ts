import type { CatalogItem, CatalogSearchResult, Category } from "@/lib/types";

export interface CatalogProvider {
  readonly category: Category;
  search(query: string, page?: number): Promise<CatalogSearchResult[]>;
  getDetails(providerId: string): Promise<CatalogItem | null>;
}

export class CatalogProviderError extends Error {
  constructor(public readonly provider: string, message: string, public readonly status = 502) {
    super(message);
    this.name = "CatalogProviderError";
  }
}
