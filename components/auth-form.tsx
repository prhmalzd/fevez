"use client";

import { ArrowRight, LockKeyhole, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthMode = "login" | "signup";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (mode === "signup" && password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured yet.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.replace("/home");
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` }
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      router.replace("/onboarding");
      router.refresh();
      return;
    }
    setNotice("Account created. Check your inbox to confirm your email, then log in.");
  }

  return <div style={{ display: "grid", gap: 18 }}>
    <div className="surface" aria-label="Authentication mode" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: 5, borderRadius: 14 }}>
      <button type="button" aria-pressed={mode === "login"} onClick={() => changeMode("login")} className={mode === "login" ? "primary-button" : "secondary-button"} style={{ justifyContent: "center" }}>Log in</button>
      <button type="button" aria-pressed={mode === "signup"} onClick={() => changeMode("signup")} className={mode === "signup" ? "primary-button" : "secondary-button"} style={{ justifyContent: "center" }}>Create account</button>
    </div>

    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <div className="field-group" style={{ marginBottom: 0 }}>
        <label htmlFor="auth-email">Email address</label>
        <input id="auth-email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" placeholder="you@example.com" type="email" autoComplete="email" required />
      </div>
      <div className="field-group" style={{ marginBottom: 0 }}>
        <label htmlFor="auth-password">Password</label>
        <input id="auth-password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} className="field" placeholder={mode === "signup" ? "At least 8 characters" : "Your password"} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 8 : 6} required />
      </div>
      <button disabled={loading || !email || !password} type="submit" className="primary-button" style={{ marginTop: 4 }}>
        {mode === "signup" ? <UserPlus size={17} /> : <LockKeyhole size={17} />}
        {loading ? "Please wait…" : mode === "signup" ? "Create my account" : "Log in"}
        {!loading && <ArrowRight size={16} />}
      </button>
      {error && <p role="alert" style={{ color: "#c73d30", fontSize: 13, margin: 0 }}>{error}</p>}
      {notice && <p role="status" className="surface" style={{ fontSize: 13, lineHeight: 1.5, margin: 0, padding: 14, borderRadius: 12 }}>{notice}</p>}
    </form>
  </div>;
}
