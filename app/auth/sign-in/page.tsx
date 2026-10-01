import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Brand } from "@/components/brand";

export const metadata = { title: "Sign in" };
export default function SignInPage() { return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 22 }}><div style={{ width: "min(100%, 420px)" }}><div style={{ display: "flex", justifyContent: "center", marginBottom: 35 }}><Brand /></div><section className="surface" style={{ borderRadius: 24, padding: "32px 28px", boxShadow: "var(--shadow)" }}><span className="eyebrow">Welcome back</span><h1 className="serif" style={{ fontSize: 38, letterSpacing: "-.04em", margin: "8px 0 12px" }}>Sign in to Fevez</h1><p className="muted" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 25 }}>Your collections and favorite people are waiting.</p><AuthForm /></section><p className="muted" style={{ textAlign: "center", fontSize: 12, marginTop: 20 }}>New here? <Link className="text-button" href="/onboarding">Create your profile</Link></p></div></main>; }
