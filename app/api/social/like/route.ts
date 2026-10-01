import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z.object({ activityId: z.string().uuid() });

async function context(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return { response: NextResponse.json({ error: "Invalid activity" }, { status: 400 }) };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { response: NextResponse.json({ error: "Database is not configured" }, { status: 503 }) };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { response: NextResponse.json({ error: "Sign in required" }, { status: 401 }) };
  return { supabase, user, activityId: parsed.data.activityId };
}

export async function POST(request: Request) {
  const value = await context(request);
  if ("response" in value) return value.response;
  const { error } = await value.supabase.from("activity_likes").insert({ activity_id: value.activityId, user_id: value.user.id });
  if (error && error.code !== "23505") return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ liked: true });
}

export async function DELETE(request: Request) {
  const value = await context(request);
  if ("response" in value) return value.response;
  const { error } = await value.supabase.from("activity_likes").delete().eq("activity_id", value.activityId).eq("user_id", value.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ liked: false });
}
