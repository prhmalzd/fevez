"use client";

import { ArrowRight, Check, Film, Gamepad2, Music2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const interests = [{ label: "Movies", icon: Film }, { label: "Albums", icon: Music2 }, { label: "Games", icon: Gamepad2 }];
export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(["Movies", "Albums", "Games"]);
  return <div>
    <div className="muted" style={{ fontSize: 12, marginBottom: 24 }}>Step {step} of 2</div>
    {step === 1 ? <><div className="field-group"><label htmlFor="name">Display name</label><input className="field" id="name" placeholder="Your name" /></div><div className="field-group"><label htmlFor="handle">Username</label><input className="field" id="handle" placeholder="your_handle" /></div><div className="field-group"><label htmlFor="onboardingBio">Short bio <span className="muted">(optional)</span></label><textarea className="field" id="onboardingBio" maxLength={160} placeholder="What kind of stories stay with you?" /></div></> : <><p className="muted" style={{ fontSize: 14 }}>Choose the collections you want to show. You can change this later.</p><div style={{ display: "grid", gap: 10 }}>{interests.map(({ label, icon: Icon }) => { const active = selected.includes(label); return <button key={label} onClick={() => setSelected((items) => active ? items.filter((item) => item !== label) : [...items, label])} className="surface" style={{ display: "flex", padding: 16, alignItems: "center", gap: 12, borderRadius: 15, cursor: "pointer", color: "var(--ink)" }}><Icon size={20} /><strong>{label}</strong>{active && <Check size={18} style={{ color: "var(--accent)", marginLeft: "auto" }} />}</button>; })}</div></>}
    <button className="primary-button" style={{ width: "100%", marginTop: 24 }} onClick={() => step === 1 ? setStep(2) : router.push("/home")}>{step === 1 ? <>Continue <ArrowRight size={17} /></> : "Start exploring"}</button>
  </div>;
}
