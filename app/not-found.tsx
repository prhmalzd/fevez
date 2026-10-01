import Link from "next/link";
import { Brand } from "@/components/brand";

export default function NotFound() { return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: 20 }}><div><div style={{ display: "flex", justifyContent: "center" }}><Brand /></div><div className="serif" style={{ fontSize: 90, color: "var(--accent)", margin: "35px 0 0" }}>404</div><h1 className="serif">This one isn&apos;t in the collection.</h1><p className="muted">The page may have moved, or never existed.</p><Link href="/" className="primary-button" style={{ marginTop: 15 }}>Back to Fevez</Link></div></main>; }
