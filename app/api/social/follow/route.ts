import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { usernameSchema } from "@/lib/validation";

const bodySchema = z.object({ username: usernameSchema });

async function context(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return { response: NextResponse.json({ error: "Invalid username" }, { status: 400 }) };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { response: NextResponse.json({ error: "Database is not configured" }, { status: 503 }) };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { response: NextResponse.json({ error: "Sign in required" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("id").ilike("username", parsed.data.username).maybeSingle();
  if (!profile) return { response: NextResponse.json({ error: "Profile not found" }, { status: 404 }) };
  if (profile.id === user.id) return { response: NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 }) };
  return { supabase, user, followedId: profile.id };
}

export async function POST(request: Request) {
  const value = await context(request);
  if ("response" in value) return value.response;
  const { error } = await value.supabase.from("follows").insert({ follower_id: value.user.id, followed_id: value.followedId });
  if (error && error.code !== "23505") return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ following: true });
}

export async function DELETE(request: Request) {
  const value = await context(request);
  if ("response" in value) return value.response;
  const { error } = await value.supabase.from("follows").delete().eq("follower_id", value.user.id).eq("followed_id", value.followedId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ following: false });
}
