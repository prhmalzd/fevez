"use client";

import { Compass, Home, Settings, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";
import { currentUser, people } from "@/lib/demo-data";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: `/u/${currentUser.username}`, label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings }
];

function SideNav() {
  const pathname = usePathname();
  return <>
    <Brand />
    <nav className="nav-list" aria-label="Primary navigation">
      {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link ${pathname.startsWith(href) ? "active" : ""}`}><Icon size={21} strokeWidth={2} /><span>{label}</span></Link>)}
    </nav>
    <Link href={`/u/${currentUser.username}`} className="user-chip surface">
      <Image className="avatar" src={currentUser.avatar} alt="" width={39} height={39} />
      <div><strong style={{ display: "block", fontSize: 13 }}>{currentUser.name}</strong><span className="muted" style={{ fontSize: 12 }}>@{currentUser.username}</span></div>
    </Link>
  </>;
}

function RightRail() {
  return <aside className="right-rail">
    <div className="right-card surface">
      <h2>People with good taste</h2>
      {people.slice(1).map((person) => <div className="suggestion" key={person.username}>
        <Image className="avatar" src={person.avatar} alt="" width={38} height={38} />
        <div style={{ minWidth: 0 }}><strong style={{ display: "block", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{person.name}</strong><span className="muted" style={{ fontSize: 11 }}>@{person.username}</span></div>
        <button className="secondary-button">Follow</button>
      </div>)}
      <Link href="/explore?tab=people" className="text-button" style={{ fontSize: 13 }}>See more</Link>
    </div>
    <div className="muted" style={{ fontSize: 11, lineHeight: 1.6, padding: "0 6px" }}>Catalog data from TMDB, MusicBrainz, Cover Art Archive and IGDB.<br />© 2026 Fevez</div>
  </aside>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="app-layout">
    <aside className="left-rail"><SideNav /></aside>
    <main className="main-column">{children}</main>
    <RightRail />
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {links.map(({ href, label, icon: Icon }) => <Link aria-label={label} key={href} href={href} className={pathname.startsWith(href) ? "active" : ""}><Icon size={21} /></Link>)}
    </nav>
  </div>;
}
