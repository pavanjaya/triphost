import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Howztrip",
  description: "Your trip, answered.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Howztrip" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head><link rel="apple-touch-icon" href="/icons/icon-192.png" /></head>
      <body className={`antialiased ${jakarta.variable}`} style={{ background: "#e5e5e3" }}>
        <AuthProvider>
          <div className="mx-auto min-h-dvh" style={{ maxWidth: 430, background: "#f7f7f5" }}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
