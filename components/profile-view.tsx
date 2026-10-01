import { ArrowRight, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "@/components/follow-button";
import { categoryLabels, currentUser, itemsFor } from "@/lib/demo-data";
import type { Person } from "@/lib/types";

export function ProfileView({ person }: { person: Person }) {
  const isMe = person.username === currentUser.username;
  return <>
    <div className="profile-cover"><Image src={person.header} alt="" fill priority sizes="650px" /></div>
    <section className="profile-body">
      <div className="profile-top"><Image className="avatar profile-avatar" src={person.avatar} alt={`${person.name}'s profile picture`} width={112} height={112} />
        <div className="profile-actions"><button className="icon-button" aria-label="More profile options"><MoreHorizontal size={19} /></button>{isMe ? <Link className="secondary-button" href="/settings">Edit profile</Link> : <FollowButton initial={person.isFollowing} username={person.username} />}</div>
      </div>
      <h1 className="profile-name">{person.name}</h1><div className="muted">@{person.username}</div>
      <p className="profile-bio">{person.bio}</p>
      <div className="profile-stats"><span><strong>{person.following}</strong> following</span><span><strong>{person.followers}</strong> followers</span></div>
    </section>
    {person.visibleCategories.map((category) => {
      const items = itemsFor(category).slice(0, 4);
      return <section className="category-summary" key={category}>
        <div className="category-row">
          <div><span className="eyebrow">Top 25</span><h2 className="section-title" style={{ marginTop: 6 }}>{categoryLabels[category]}</h2><Link href={`/u/${person.username}/${category}`} className="text-button" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5, marginTop: 12 }}>See all <ArrowRight size={14} /></Link></div>
          <div className="poster-stack">{items.map((item, index) => <Link href={`/item/${item.category}/${item.providerId}`} className="poster" key={item.id}><Image src={item.image} alt={item.title} fill sizes="110px" /><span className="rank-badge">{index + 1}</span></Link>)}</div>
        </div>
      </section>;
    })}
    {person.visibleCategories.length === 0 && <div className="empty">No public collections yet.</div>}
  </>;
}
