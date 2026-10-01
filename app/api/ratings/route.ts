import { NextResponse } from "next/server";
import { z } from "zod";
import { categories } from "@/lib/types";
import { ratingSchema } from "@/lib/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const itemSchema = z.object({
  providerId: z.string().min(1), category: z.enum(categories), title: z.string().min(1).max(200), subtitle: z.string().max(200), year: z.number().int(), image: z.string(), backdrop: z.string().optional(), description: z.string().max(5000), metadata: z.array(z.string()).max(10), providerScore: z.number().min(0).max(10).optional()
});
const bodySchema = z.object({ item: itemSchema, score: ratingSchema.shape.score, note: z.string().trim().max(280) });
const providers = { movies: "tmdb", music: "musicbrainz", games: "igdb" } as const;

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { item, score, note } = parsed.data;
  const { data: storedItem, error: itemError } = await supabase.from("catalog_items").upsert({ provider: providers[item.category], provider_id: item.providerId, category: item.category, title: item.title, subtitle: item.subtitle, release_year: item.year || null, image_url: item.image, backdrop_url: item.backdrop ?? null, description: item.description, metadata: { labels: item.metadata }, provider_score: item.providerScore ?? null, refreshed_at: new Date().toISOString() }, { onConflict: "provider,provider_id" }).select("id").single();
  if (itemError || !storedItem) return NextResponse.json({ error: itemError?.message ?? "Could not store item" }, { status: 400 });
  const { data: existing } = await supabase.from("ratings").select("id,rank").eq("user_id", user.id).eq("item_id", storedItem.id).maybeSingle();
  if (existing) {
    const { error } = await supabase.from("ratings").update({ score, note }).eq("id", existing.id).eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: existing.id, updated: true });
  }
  const { count } = await supabase.from("ratings").select("id,catalog_items!inner(category)", { count: "exact", head: true }).eq("user_id", user.id).eq("catalog_items.category", item.category);
  if ((count ?? 0) >= 25) return NextResponse.json({ error: `Your ${item.category} collection is full` }, { status: 409 });
  const { data: rating, error } = await supabase.from("ratings").insert({ user_id: user.id, item_id: storedItem.id, score, note, rank: (count ?? 0) + 1 }).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: rating.id, created: true }, { status: 201 });
}
