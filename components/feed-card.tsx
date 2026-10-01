"use client";

import { Gamepad2, Heart, Music2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Rating } from "@/lib/types";

const icons = { movies: Star, music: Music2, games: Gamepad2 };
const labels = { movies: "rated a movie", music: "rated an album", games: "rated a game" };

export function FeedCard({ rating }: { rating: Rating }) {
  const [liked, setLiked] = useState(Boolean(rating.liked));
  const [count, setCount] = useState(rating.likes);
  const Icon = icons[rating.item.category];
  async function toggleLike() {
    const previous = liked;
    setLiked(!previous);
    setCount((value) => value + (previous ? -1 : 1));
    if (!rating.activityId) return;
    try {
      const response = await fetch("/api/social/like", { method: previous ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activityId: rating.activityId }) });
      if (!response.ok) throw new Error("Like failed");
    } catch {
      setLiked(previous);
      setCount((value) => value + (previous ? 1 : -1));
    }
  }
  return <article className="feed-card">
    <div className="feed-author">
      <Link href={`/u/${rating.user.username}`} className="author-meta">
        <Image className="avatar" src={rating.user.avatar} alt="" width={42} height={42} />
        <div><strong style={{ fontSize: 14 }}>{rating.user.name}</strong><div className="muted" style={{ fontSize: 12 }}>@{rating.user.username} · {rating.createdAt}</div></div>
      </Link>
      <span className="category-tag"><Icon size={13} />{labels[rating.item.category]}</span>
    </div>
    <div className="feed-content">
      <Link className="poster" href={`/item/${rating.item.category}/${rating.item.providerId}`}><Image src={rating.item.image} alt={`${rating.item.title} artwork`} fill sizes="112px" /></Link>
      <div>
        <Link href={`/item/${rating.item.category}/${rating.item.providerId}`}><h2 className="serif" style={{ fontSize: 23, margin: "2px 0 3px", letterSpacing: "-.02em" }}>{rating.item.title}</h2><div className="muted" style={{ fontSize: 13 }}>{rating.item.subtitle} · {rating.item.year}</div></Link>
        <div style={{ marginTop: 12 }} className="score">{rating.score.toFixed(1)}<small>/10</small></div>
        {rating.note && <p className="note">“{rating.note}”</p>}
        <div className="feed-actions"><button onClick={toggleLike} className={`like-button ${liked ? "liked" : ""}`} aria-pressed={liked} aria-label={liked ? "Unlike" : "Like"}><Heart size={18} fill={liked ? "currentColor" : "none"} />{count}</button></div>
      </div>
    </div>
  </article>;
}
