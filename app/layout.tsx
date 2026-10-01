import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Fevez — Your taste, in one place", template: "%s · Fevez" },
  description: "Collect, rank and share the movies, albums and games that made you.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
