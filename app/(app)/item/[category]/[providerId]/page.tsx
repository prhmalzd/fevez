import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedCard } from "@/components/feed-card";
import { RatingDialog } from "@/components/rating-dialog";
import { catalogProviders } from "@/lib/catalog";
import { catalog, ratings } from "@/lib/demo-data";
import { categories, type Category } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  const item = catalog.find((entry) => entry.providerId === providerId);
  return { title: item?.title ?? "Item", description: item?.description };
}

export default async function ItemPage({ params }: { params: Promise<{ category: string; providerId: string }> }) {
  const { category, providerId } = await params;
  if (!categories.includes(category as Category)) notFound();
  let item = catalog.find((entry) => entry.category === category && entry.providerId === providerId) ?? null;
  if (!item) {
    try { item = await catalogProviders[category as Category].getDetails(providerId); }
    catch { item = null; }
  }
  if (!item) notFound();
  const itemRatings = ratings.filter((rating) => rating.item.id === item.id);
  return <>
    <section className="item-hero">
      <Image className="item-hero-bg" src={item.backdrop ?? item.image} alt="" fill priority sizes="650px" />
      <div className="item-hero-content"><div className="poster"><Image src={item.image} alt={`${item.title} artwork`} fill sizes="130px" /></div><div><Link href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12 }}><ArrowLeft size={14} /> Explore</Link><h1>{item.title}</h1><p style={{ margin: "0 0 14px", opacity: .78 }}>{item.subtitle} · {item.year}</p><div className="metadata">{item.metadata.map((value) => <span key={value}>{value}</span>)}</div></div></div>
    </section>
    <section className="section"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 20 }}><div><span className="eyebrow">About</span><p className="serif" style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 420 }}>{item.description}</p></div><div style={{ textAlign: "right", whiteSpace: "nowrap" }}><div className="score"><Star size={18} fill="currentColor" />{item.providerScore?.toFixed(1)}</div><div className="muted" style={{ fontSize: 11 }}>provider score</div></div></div><RatingDialog item={item} /></section>
    <div className="section-head" style={{ padding: "24px 28px 8px", borderTop: "1px solid var(--line)", margin: 0 }}><h2 className="section-title">Recent ratings</h2><span className="muted" style={{ fontSize: 13 }}>{itemRatings.length || 0} ratings</span></div>
    {itemRatings.length ? itemRatings.map((rating) => <FeedCard rating={rating} key={rating.id} />) : <div className="empty">Be the first person to rate this.</div>}
  </>;
}
