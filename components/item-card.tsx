import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/lib/types";

export function ItemCard({ item, rank, score }: { item: CatalogItem; rank?: number; score?: number }) {
  return <Link className="item-card" href={`/item/${item.category}/${item.providerId}`}>
    <div className="poster"><Image src={item.image} alt={`${item.title} artwork`} fill sizes="(max-width: 760px) 45vw, 180px" />{rank && <span className="rank-badge">{rank}</span>}{score && <span className="card-score">{score.toFixed(1)}</span>}</div>
    <h3>{item.title}</h3><p>{item.subtitle} · {item.year}</p>
  </Link>;
}
