import { Brand } from "@/components/brand";
import { OnboardingForm } from "@/components/onboarding-form";

export const metadata = { title: "Create your profile" };
export default function OnboardingPage() { return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 22 }}><div style={{ width: "min(100%, 500px)", padding: "35px 0" }}><div style={{ display: "flex", justifyContent: "center", marginBottom: 35 }}><Brand /></div><section className="surface" style={{ borderRadius: 24, padding: "32px 28px", boxShadow: "var(--shadow)" }}><span className="eyebrow">Make it yours</span><h1 className="serif" style={{ fontSize: 38, letterSpacing: "-.04em", margin: "8px 0 12px" }}>Build your taste profile</h1><OnboardingForm /></section></div></main>; }
