import { ratings as demoRatings } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Rating } from "@/lib/types";

type TimelineRow = {
  id: string;
  created_at: string;
  profiles: { username: string; display_name: string; bio: string; avatar_url: string | null; header_url: string | null };
  ratings: {
    id: string; score: number; note: string; rank: number;
    catalog_items: { id: string; provider_id: string; category: Category; title: string; subtitle: string; release_year: number | null; image_url: string | null; backdrop_url: string | null; description: string; metadata: { labels?: string[] } | null; provider_score: number | null };
  };
  activity_likes: Array<{ user_id: string }>;
};

function relativeTime(value: string) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr`;
  return `${Math.floor(seconds / 86400)}d`;
}

export async function getTimeline(): Promise<Rating[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoRatings;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return demoRatings;
  const { data: follows } = await supabase.from("follows").select("followed_id").eq("follower_id", user.id);
  const followedIds = follows?.map((follow) => follow.followed_id) ?? [];
  if (!followedIds.length) return [];
  const { data, error } = await supabase.from("activities").select("id,created_at,profiles!activities_user_id_fkey(username,display_name,bio,avatar_url,header_url),ratings!inner(id,score,note,rank,catalog_items!inner(id,provider_id,category,title,subtitle,release_year,image_url,backdrop_url,description,metadata,provider_score)),activity_likes(user_id)").in("user_id", followedIds).order("created_at", { ascending: false }).limit(50);
  if (error || !data) return demoRatings;
  return (data as unknown as TimelineRow[]).map((activity) => {
    const profile = activity.profiles;
    const item = activity.ratings.catalog_items;
    return {
      id: activity.ratings.id,
      activityId: activity.id,
      user: { username: profile.username, name: profile.display_name, bio: profile.bio, avatar: profile.avatar_url ?? "/placeholder-art.svg", header: profile.header_url ?? "/placeholder-art.svg", followers: 0, following: 0, visibleCategories: ["movies", "music", "games"] },
      item: { id: item.id, providerId: item.provider_id, category: item.category, title: item.title, subtitle: item.subtitle, year: item.release_year ?? 0, image: item.image_url ?? "/placeholder-art.svg", backdrop: item.backdrop_url ?? undefined, description: item.description, metadata: item.metadata?.labels ?? [], providerScore: item.provider_score ?? undefined },
      score: Number(activity.ratings.score), note: activity.ratings.note || undefined, rank: activity.ratings.rank, createdAt: relativeTime(activity.created_at), likes: activity.activity_likes.length, liked: activity.activity_likes.some((like) => like.user_id === user.id)
    };
  });
}
