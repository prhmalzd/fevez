"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ItemCard } from "@/components/item-card";
import { catalog, categoryLabels, people } from "@/lib/demo-data";
import type { CatalogItem, CatalogSearchResult, Category } from "@/lib/types";

type Tab = Category | "people";
const tabs: { id: Tab; label: string }[] = [{ id: "movies", label: "Movies" }, { id: "music", label: "Albums" }, { id: "games", label: "Games" }, { id: "people", label: "People" }];

export function ExploreView() {
  const [tab, setTab] = useState<Tab>("movies");
  const [query, setQuery] = useState("");
  const [liveItems, setLiveItems] = useState<CatalogItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const shouldSearchCatalog = tab !== "people" && query.trim().length >= 2;
  useEffect(() => {
    if (tab === "people" || query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setSearchError("");
      try {
        const response = await fetch(`/api/catalog/search?category=${tab}&q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        const payload = await response.json() as { results?: CatalogSearchResult[]; error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Search unavailable");
        setLiveItems((payload.results ?? []).map((item) => ({ ...item, id: `${item.category}:${item.providerId}`, description: "", metadata: [] })));
      } catch (error) {
        if (!controller.signal.aborted) { setSearchError(error instanceof Error ? error.message : "Search unavailable"); setLiveItems([]); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, tab]);
  const filteredItems = useMemo(() => (shouldSearchCatalog ? liveItems : null) ?? catalog.filter((item) => item.category === tab && `${item.title} ${item.subtitle}`.toLowerCase().includes(query.toLowerCase())), [tab, query, liveItems, shouldSearchCatalog]);
  const filteredPeople = people.filter((person) => `${person.name} ${person.username}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <div className="section" style={{ paddingBottom: 18 }}><div className="search-wrap"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="search-input" placeholder="Search movies, albums, games and people" aria-label="Search" /></div></div>
    <div className="tabs" role="tablist">{tabs.map((item) => <button key={item.id} role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} className={`tab ${tab === item.id ? "active" : ""}`}>{item.label}</button>)}</div>
    <section className="section">
      <div className="section-head"><div><span className="eyebrow">Explore</span><h2 className="section-title" style={{ marginTop: 7 }}>{tab === "people" ? "People worth following" : `Popular ${categoryLabels[tab].toLowerCase()}`}</h2></div></div>
      {shouldSearchCatalog && loading && <div className="muted" style={{ paddingBottom: 18 }}>Searching the catalog…</div>}{shouldSearchCatalog && searchError && <div role="alert" style={{ color: "#c73d30", fontSize: 13, paddingBottom: 18 }}>{searchError}. Demo results remain available when they match.</div>}
      {tab === "people" ? <div style={{ display: "grid", gap: 12 }}>{filteredPeople.map((person) => <Link href={`/u/${person.username}`} className="surface" style={{ padding: 14, borderRadius: 16, display: "flex", alignItems: "center", gap: 13 }} key={person.username}><Image className="avatar" src={person.avatar} alt="" width={52} height={52} /><div><strong>{person.name}</strong><div className="muted" style={{ fontSize: 13 }}>@{person.username} · {person.followers} followers</div></div><span className="secondary-button" style={{ marginLeft: "auto", minHeight: 36 }}>View</span></Link>)}</div> : <div className="item-grid">{filteredItems.map((item, index) => <ItemCard item={item} rank={index + 1} key={item.id} />)}</div>}
      {!loading && (tab === "people" ? filteredPeople.length === 0 : filteredItems.length === 0) && <div className="empty">Nothing found for “{query}”. Try another search.</div>}
    </section>
  </>;
}
