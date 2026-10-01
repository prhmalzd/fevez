import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemCard } from "@/components/item-card";
import { categoryLabels, currentUser, itemsFor, people } from "@/lib/demo-data";
import { categories, type Category } from "@/lib/types";

export default async function CollectionPage({ params }: { params: Promise<{ username: string; category: string }> }) {
  const { username, category: rawCategory } = await params;
  const person = [currentUser, ...people].find((entry) => entry.username === username);
  if (!person || !categories.includes(rawCategory as Category)) notFound();
  const category = rawCategory as Category;
  if (!person.visibleCategories.includes(category)) notFound();
  const items = itemsFor(category);
  return <><header className="page-header"><div><Link className="muted" href={`/u/${username}`} style={{ display: "inline-flex", gap: 5, alignItems: "center", fontSize: 12, marginBottom: 8 }}><ArrowLeft size={14} />{person.name}</Link><h1 className="page-title">Top {categoryLabels[category]}</h1></div><span className="muted" style={{ fontSize: 13 }}>{items.length} of 25</span></header>
    <section className="section"><div className="item-grid">{items.map((item, index) => <ItemCard key={item.id} item={item} rank={index + 1} score={Math.max(7.5, 9.5 - index * .5)} />)}</div></section>
  </>;
}
