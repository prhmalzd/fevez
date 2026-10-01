"use client";

import { GripVertical, LogOut, Moon, Save, Sun } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { categoryLabels, currentUser } from "@/lib/demo-data";
import type { Category } from "@/lib/types";

export function SettingsView() {
  const [dark, setDark] = useState(false);
  const [visible, setVisible] = useState<Record<Category, boolean>>({ movies: true, music: true, games: true });
  const [saved, setSaved] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return <div className="section settings-grid">
    <section className="settings-card surface">
      <h2>Your profile</h2><p className="muted" style={{ margin: 0, fontSize: 13 }}>The details people see on your public page.</p>
      <div style={{ display: "flex", alignItems: "center", gap: 15, marginTop: 22 }}><Image className="avatar" src={currentUser.avatar} alt="" width={72} height={72} /><button className="secondary-button">Change photo</button></div>
      <div className="field-group"><label htmlFor="displayName">Display name</label><input id="displayName" className="field" defaultValue={currentUser.name} /></div>
      <div className="field-group"><label htmlFor="username">Username</label><input id="username" className="field" defaultValue={currentUser.username} /></div>
      <div className="field-group"><label htmlFor="bio">Bio</label><textarea id="bio" className="field" maxLength={160} defaultValue={currentUser.bio} /><span className="muted" style={{ fontSize: 11 }}>Up to 160 characters</span></div>
      <button className="primary-button" style={{ marginTop: 18 }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1600); }}><Save size={17} />{saved ? "Saved" : "Save changes"}</button>
    </section>
    <section className="settings-card surface">
      <h2>Profile categories</h2><p className="muted" style={{ margin: 0, fontSize: 13 }}>Choose what appears and drag to set the order.</p>
      <div style={{ marginTop: 13 }}>{(Object.keys(categoryLabels) as Category[]).map((category) => <div className="toggle-row" key={category}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><GripVertical size={18} className="muted" /><div><strong style={{ fontSize: 14 }}>{categoryLabels[category]}</strong><div className="muted" style={{ fontSize: 11 }}>{visible[category] ? "Visible on your profile" : "Hidden, ratings preserved"}</div></div></div><button aria-label={`${visible[category] ? "Hide" : "Show"} ${categoryLabels[category]}`} aria-pressed={visible[category]} onClick={() => setVisible((state) => ({ ...state, [category]: !state[category] }))} className={`toggle ${visible[category] ? "on" : ""}`} /></div>)}</div>
    </section>
    <section className="settings-card surface"><h2>Appearance</h2><div className="toggle-row" style={{ border: 0 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}>{dark ? <Moon size={18} /> : <Sun size={18} />}<div><strong style={{ fontSize: 14 }}>{dark ? "Dark" : "Light"} theme</strong><div className="muted" style={{ fontSize: 11 }}>Stored on this device</div></div></div><button aria-label="Toggle dark theme" aria-pressed={dark} onClick={() => setDark(!dark)} className={`toggle ${dark ? "on" : ""}`} /></div></section>
    <section className="settings-card surface"><h2>Account</h2><p className="muted" style={{ fontSize: 13 }}>Signed in as samira@example.com</p><button className="secondary-button"><LogOut size={16} /> Sign out</button><button className="text-button" style={{ display: "block", marginTop: 22, color: "#c73d30" }}>Delete account</button></section>
  </div>;
}
