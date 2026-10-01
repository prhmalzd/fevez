import { SlidersHorizontal } from "lucide-react";
import { FeedCard } from "@/components/feed-card";
import { PageHeader } from "@/components/page-header";
import { getTimeline } from "@/lib/data";

export const metadata = { title: "Home" };

export default async function HomePage() {
  const ratings = await getTimeline();
  return <><PageHeader title="Your timeline" action={<button aria-label="Feed options" className="icon-button"><SlidersHorizontal size={18} /></button>} />
    <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--line)" }}><span className="muted" style={{ fontSize: 13 }}>Fresh ratings from people you follow</span></div>
    {ratings.length ? ratings.map((rating) => <FeedCard key={rating.id} rating={rating} />) : <div className="empty"><strong style={{ color: "var(--ink)" }}>Your timeline is ready for people.</strong><p>Follow someone in Explore to see their newest ratings here.</p></div>}
  </>;
}
