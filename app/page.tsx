import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { catalog } from "@/lib/demo-data";

export default function LandingPage() {
  const featured = [catalog[0], catalog[5], catalog[9]];
  return <main className="hero">
    <div className="page-wrap">
      <nav className="landing-nav"><Brand /><div style={{ display: "flex", gap: 10 }}><Link href="/auth/sign-in" className="secondary-button">Sign in</Link><Link href="/onboarding" className="primary-button">Join Fevez</Link></div></nav>
      <section className="hero-grid">
        <div>
          <span className="eyebrow"><Sparkles size={13} style={{ verticalAlign: -2, marginRight: 7 }} />Your taste tells a story</span>
          <h1>Keep what<br />moves you.</h1>
          <p className="hero-copy">Rank the movies, albums and games you love. Find your people through the things you can&apos;t stop thinking about.</p>
          <div className="hero-actions"><Link className="primary-button" href="/onboarding">Create your profile <ArrowRight size={18} /></Link><Link className="secondary-button" href="/u/noahframes">See a profile</Link></div>
          <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>Free during our early access.</p>
        </div>
        <div className="taste-collage" aria-label="A sample of favorite movies, albums and games">
          {featured.map((item, index) => <div className="collage-card" key={item.id}><div className="poster"><Image src={item.image} alt="" fill sizes="220px" /></div><h3>{item.title}</h3><p>#{index + 1} in {item.category} · {(9.5 - index * .5).toFixed(1)}</p></div>)}
        </div>
      </section>
    </div>
  </main>;
}
