"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CatalogItem } from "@/lib/types";

export function RatingDialog({ item }: { item: CatalogItem }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(8);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function saveRating() {
    setSaving(true); setError("");
    const note = (document.querySelector("[aria-label='Rating note']") as HTMLTextAreaElement | null)?.value ?? "";
    try {
      const response = await fetch("/api/ratings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ item, score, note }) });
      if (response.status === 401) { router.push(`/auth/sign-in?next=/item/${item.category}/${item.providerId}`); return; }
      if (response.status === 503) { setSaved(true); return; }
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not save rating");
      setSaved(true); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save rating"); }
    finally { setSaving(false); }
  }
  if (!open) return <button className="primary-button" onClick={() => setOpen(true)}>Add to my Top 25</button>;
  return <div className="surface" style={{ borderRadius: 18, padding: 20, marginTop: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><div><span className="eyebrow">Your rating</span><h3 className="serif" style={{ margin: "6px 0" }}>{item.title}</h3></div><button className="icon-button" aria-label="Close rating form" onClick={() => setOpen(false)}><X size={17} /></button></div>
    <label htmlFor="score" style={{ display: "block", margin: "12px 0 8px", fontWeight: 700 }}>Score: <span className="score" style={{ fontSize: 22 }}>{score.toFixed(1)}</span></label>
    <input id="score" style={{ width: "100%", accentColor: "var(--accent)" }} type="range" min="1" max="10" step=".5" value={score} onChange={(event) => setScore(Number(event.target.value))} />
    <textarea className="field" maxLength={280} placeholder="A short note (optional)" aria-label="Rating note" style={{ marginTop: 15 }} />
    <button disabled={saving} className="primary-button" style={{ marginTop: 12 }} onClick={saveRating}>{saved ? <><Check size={17} /> Saved</> : saving ? "Saving…" : "Save rating"}</button>{error && <p role="alert" style={{ color: "#c73d30", fontSize: 13 }}>{error}</p>}
  </div>;
}
