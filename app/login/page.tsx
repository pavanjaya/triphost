"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

function TravelIllustration() {
  return (
    <svg viewBox="0 0 288 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Sky background */}
      <rect width="288" height="220" rx="32" fill="#e8f4fd"/>

      {/* Sun */}
      <circle cx="230" cy="48" r="28" fill="#fbbf24" opacity="0.9"/>
      <circle cx="230" cy="48" r="20" fill="#fcd34d"/>

      {/* Clouds */}
      <ellipse cx="60" cy="55" rx="34" ry="16" fill="white" opacity="0.9"/>
      <ellipse cx="80" cy="48" rx="24" ry="18" fill="white" opacity="0.9"/>
      <ellipse cx="44" cy="52" rx="20" ry="14" fill="white" opacity="0.9"/>

      <ellipse cx="180" cy="70" rx="28" ry="13" fill="white" opacity="0.7"/>
      <ellipse cx="196" cy="64" rx="20" ry="15" fill="white" opacity="0.7"/>
      <ellipse cx="166" cy="67" rx="16" ry="11" fill="white" opacity="0.7"/>

      {/* Ground */}
      <rect x="0" y="155" width="288" height="65" rx="0" fill="#86efac" opacity="0.6"/>
      <rect x="0" y="170" width="288" height="50" rx="0" fill="#4ade80" opacity="0.5"/>
      <rect x="0" y="190" width="288" height="30" rx="0" fill="#22c55e" opacity="0.4"/>
      {/* Ground bottom rounded */}
      <rect x="0" y="200" width="288" height="20" rx="0" fill="#16a34a" opacity="0.3"/>
      <path d="M0 210 Q144 195 288 210 L288 220 L0 220 Z" fill="#15803d" opacity="0.25"/>

      {/* Mountains */}
      <polygon points="30,158 80,90 130,158" fill="#6b7280" opacity="0.5"/>
      <polygon points="60,158 110,100 160,158" fill="#9ca3af" opacity="0.45"/>
      <polygon points="150,158 195,108 240,158" fill="#6b7280" opacity="0.4"/>
      {/* Snow caps */}
      <polygon points="80,90 93,112 67,112" fill="white" opacity="0.7"/>
      <polygon points="110,100 122,118 98,118" fill="white" opacity="0.6"/>
      <polygon points="195,108 206,124 184,124" fill="white" opacity="0.6"/>

      {/* Road */}
      <path d="M60 220 Q144 185 228 220" stroke="#d1d5db" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M60 220 Q144 185 228 220" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" fill="none"/>
      {/* Road dashes */}
      <path d="M100 210 Q130 198 160 194" stroke="white" strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round" fill="none"/>

      {/* Airplane */}
      <g transform="translate(120, 58) rotate(-18)">
        {/* Body */}
        <ellipse cx="0" cy="0" rx="22" ry="7" fill="white"/>
        {/* Nose */}
        <path d="M22 0 Q30 0 28 -2 Q26 -4 22 -3 Z" fill="white"/>
        {/* Tail */}
        <path d="M-20 0 L-26 -8 L-18 -2 Z" fill="#e2e8f0"/>
        <path d="M-20 0 L-26 6 L-18 2 Z" fill="#e2e8f0"/>
        {/* Wings */}
        <path d="M-4 0 L-14 -18 L8 -6 Z" fill="#f1f5f9"/>
        <path d="M-4 0 L-14 18 L8 6 Z" fill="#f1f5f9"/>
        {/* Window row */}
        <ellipse cx="6" cy="-2" rx="3" ry="2.5" fill="#bfdbfe"/>
        <ellipse cx="13" cy="-1.5" rx="2.5" ry="2" fill="#bfdbfe"/>
        {/* Engine */}
        <ellipse cx="-2" cy="-9" rx="5" ry="3" fill="#cbd5e1"/>
        <ellipse cx="-2" cy="9" rx="5" ry="3" fill="#cbd5e1"/>
        {/* Trail */}
        <path d="M-26 0 L-52 4" stroke="white" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" opacity="0.7"/>
      </g>

      {/* Suitcase */}
      <g transform="translate(200, 148)">
        <rect x="-14" y="0" width="28" height="22" rx="4" fill="#f97316"/>
        <rect x="-14" y="0" width="28" height="22" rx="4" stroke="#ea580c" strokeWidth="1.5" fill="none"/>
        <rect x="-6" y="-5" width="12" height="6" rx="2" stroke="#ea580c" strokeWidth="2" fill="none"/>
        <line x1="-14" y1="11" x2="14" y2="11" stroke="#ea580c" strokeWidth="1.5"/>
        <line x1="0" y1="0" x2="0" y2="22" stroke="#ea580c" strokeWidth="1.5"/>
      </g>

      {/* Map pin */}
      <g transform="translate(88, 140)">
        <circle cx="0" cy="-14" r="10" fill="#e11d48"/>
        <path d="M0 -4 Q8 4 0 20 Q-8 4 0 -4 Z" fill="#e11d48"/>
        <circle cx="0" cy="-14" r="4" fill="white"/>
      </g>

      {/* Small trees */}
      <g transform="translate(45, 150)">
        <rect x="-3" y="8" width="6" height="10" fill="#92400e" opacity="0.7"/>
        <polygon points="0,-8 -10,8 10,8" fill="#16a34a" opacity="0.8"/>
        <polygon points="0,-16 -8,0 8,0" fill="#15803d" opacity="0.9"/>
      </g>
      <g transform="translate(250, 152)">
        <rect x="-2" y="6" width="5" height="8" fill="#92400e" opacity="0.7"/>
        <polygon points="0,-6 -8,6 8,6" fill="#16a34a" opacity="0.8"/>
        <polygon points="0,-13 -6,0 6,0" fill="#15803d" opacity="0.9"/>
      </g>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const isDev = process.env.NODE_ENV === "development";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  async function handleDevGuest() {
    setLoading(true);
    await signIn("dev-guest", { callbackUrl: "/" });
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#f0efeb" }}>

      {/* Top decorative area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8">

        {/* Logo */}
        <div className="mb-10">
          <Image src="/howztrip.svg" alt="Howztrip" width={160} height={38} />
        </div>

        {/* Travel illustration */}
        <div className="w-72 mb-10">
          <TravelIllustration />
        </div>

        {/* Headline */}
        <h1 className="text-[28px] font-black text-[#111827] text-center leading-tight mb-3">
          Your trip,<br />answered.
        </h1>
        <p className="text-[14px] text-center leading-relaxed mb-12" style={{ color: "#6b7280" }}>
          All your bookings, passes, hotels<br />and itinerary — one link.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {["✈️ Flights", "🚂 Trains", "🏨 Hotels", "🎡 Activities", "💸 Expenses"].map(f => (
            <span key={f} className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "#fff", color: "#374151", border: "1px solid #e5e7eb" }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-12 flex flex-col gap-3">
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-[15px] tap-active"
          style={{
            background: "#fff",
            color: "#111827",
            border: "1.5px solid #e5e7eb",
          }}>
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {isDev && (
          <button
            onClick={handleDevGuest}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-[13px] tap-active"
            style={{ background: "#fef9c3", color: "#854d0e", border: "1.5px dashed #fbbf24" }}>
            ⚡ Continue as Guest (dev only)
          </button>
        )}

        <p className="text-center text-[11px]" style={{ color: "#9ca3af" }}>
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
