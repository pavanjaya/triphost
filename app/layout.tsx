import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripHost",
  description: "Your trip, in one place",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "TripHost" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><link rel="apple-touch-icon" href="/icons/icon-192.png" /></head>
      <body className="antialiased" style={{ background: "#e5e5e3" }}>
        <div className="mx-auto min-h-dvh" style={{ maxWidth: 430, background: "#f7f7f5" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
