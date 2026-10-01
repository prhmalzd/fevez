import { NextResponse } from "next/server";
import { catalogProviders, CatalogProviderError } from "@/lib/catalog";
import { catalog } from "@/lib/demo-data";
import { categories, type Category } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category") as Category;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  if (query.length < 2 || !categories.includes(category)) return NextResponse.json({ error: "Use a valid category and at least two search characters." }, { status: 400 });
  try {
    return NextResponse.json({ results: await catalogProviders[category].search(query, page), source: "live" });
  } catch (error) {
    const fallback = catalog.filter((item) => item.category === category && `${item.title} ${item.subtitle}`.toLowerCase().includes(query.toLowerCase()));
    if (fallback.length) return NextResponse.json({ results: fallback, source: "cache", warning: "Live catalog unavailable" });
    const message = error instanceof CatalogProviderError ? error.message : "Catalog search failed";
    return NextResponse.json({ error: message, results: [] }, { status: error instanceof CatalogProviderError ? error.status : 502 });
  }
}
