"use client";

import { ArrowRight, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthForm() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function emailSignIn() {
    setError("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setSent(true); return; }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/home` } });
    setLoading(false);
    if (signInError) setError(signInError.message); else setSent(true);
  }
  async function googleSignIn() {
    setError("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { router.push("/home"); return; }
    const { error: signInError } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=/home` } });
    if (signInError) setError(signInError.message);
  }
  return <div style={{ display: "grid", gap: 12 }}>
    {sent ? <div className="surface" style={{ padding: 18, borderRadius: 15 }}><strong>Check your inbox</strong><p className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 0 }}>We sent you a secure sign-in link. It expires shortly.</p></div> : <><label htmlFor="email" style={{ fontSize: 13, fontWeight: 700 }}>Email address</label><input id="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" placeholder="you@example.com" type="email" /><button disabled={loading || !email} onClick={emailSignIn} className="primary-button"><Mail size={17} /> {loading ? "Sending…" : "Continue with email"}</button><div className="muted" style={{ textAlign: "center", fontSize: 12 }}>or</div><button onClick={googleSignIn} className="secondary-button">Continue with Google <ArrowRight size={16} /></button>{error && <p role="alert" style={{ color: "#c73d30", fontSize: 13 }}>{error}</p>}</>}
  </div>;
}
