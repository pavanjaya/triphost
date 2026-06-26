"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Plus, Bell, ChevronRight, HelpCircle, Share2, User } from "lucide-react";
import { trips, TripSummary } from "@/lib/trips";
import { getUserTrips, UserTrip } from "@/lib/user-trips";
import MyDocuments from "@/components/MyDocuments";

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const TRIP_STYLE: Record<string, { bg: string; c1: string; c2: string; emoji: string }> = {
  "kashmir-2026":   { bg: "linear-gradient(145deg, #0f1f4a 0%, #1a3a7a 60%, #1e4799 100%)", c1: "rgba(255,255,255,0.06)", c2: "rgba(255,255,255,0.04)", emoji: "🏔️" },
  "goa-2026":       { bg: "linear-gradient(145deg, #0369a1 0%, #0284c7 60%, #38bdf8 100%)", c1: "rgba(255,255,255,0.08)", c2: "rgba(255,255,255,0.05)", emoji: "🌊" },
  "rajasthan-2025": { bg: "linear-gradient(145deg, #7c2d12 0%, #c2410c 60%, #ea580c 100%)", c1: "rgba(255,255,255,0.07)", c2: "rgba(255,255,255,0.04)", emoji: "🏰" },
};
const DEFAULT_STYLE = { bg: "linear-gradient(145deg, #1f2937 0%, #374151 100%)", c1: "rgba(255,255,255,0.06)", c2: "rgba(255,255,255,0.04)", emoji: "✈️" };

function CardBg({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} aria-hidden="true">
      <circle cx="88%" cy="-10%" r="120" fill={c1} />
      <circle cx="95%" cy="110%" r="90" fill={c2} />
      <circle cx="5%" cy="85%" r="60" fill={c1} />
    </svg>
  );
}

function HeroTripCard({ trip }: { trip: TripSummary }) {
  const s = TRIP_STYLE[trip.id] ?? DEFAULT_STYLE;
  const days = daysUntil(trip.start_date);
  return (
    <Link href={`/trip/${trip.id}`} className="block tap-active">
      <div className="rounded-[28px] overflow-hidden relative" style={{ background: s.bg }}>
        <CardBg c1={s.c1} c2={s.c2} />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[90px] leading-none select-none"
          style={{ opacity: 0.85, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))" }}>
          {s.emoji}
        </div>
        <div className="relative px-6 pt-7 pb-6" style={{ minHeight: 180 }}>
          <div className="mb-4">
            {trip.status === "active" && (
              <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full"
                style={{ background: "rgba(34,197,94,0.25)", border: "1px solid rgba(34,197,94,0.4)" }}>
                🟢 Live now
              </span>
            )}
            {trip.status === "upcoming" && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                In {days} days
              </span>
            )}
          </div>
          <h2 className="text-[26px] font-black text-white leading-tight mb-1.5" style={{ maxWidth: "65%" }}>
            {trip.name}
          </h2>
          <div className="flex items-center gap-1.5 mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            <MapPin size={11} strokeWidth={2} />
            <p className="text-[11px] font-medium">{trip.destination}</p>
          </div>
          <div className="flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14 }}>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Dates</p>
                <p className="text-[12px] font-bold text-white">{fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Group</p>
                <p className="text-[12px] font-bold text-white">{trip.group_size} travellers</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
              <span className="text-[12px] font-bold text-white">
                {trip.status === "active" ? "Open" : "View"} →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompactTripCard({ trip }: { trip: TripSummary }) {
  const s = TRIP_STYLE[trip.id] ?? DEFAULT_STYLE;
  return (
    <Link href={`/trip/${trip.id}`} className="block tap-active">
      <div className="rounded-[20px] overflow-hidden relative flex items-center gap-4 px-5 py-4"
        style={{ background: s.bg, opacity: 0.72 }}>
        <CardBg c1={s.c1} c2={s.c2} />
        <span className="text-[36px] leading-none shrink-0 relative z-10">{s.emoji}</span>
        <div className="flex-1 min-w-0 relative z-10">
          <p className="text-[15px] font-bold text-white leading-tight truncate">{trip.name}</p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
            {fmtDate(trip.start_date)} · {trip.group_size} travellers
          </p>
        </div>
        <span className="text-[11px] font-bold shrink-0 relative z-10" style={{ color: "rgba(255,255,255,0.55)" }}>Details →</span>
      </div>
    </Link>
  );
}

function UserHeroCard({ trip }: { trip: UserTrip }) {
  const today = new Date().toISOString().split("T")[0];
  const status = today < trip.start_date ? "upcoming" : today > trip.end_date ? "completed" : "active";
  const days = daysUntil(trip.start_date);
  const bg = "linear-gradient(145deg, #1f2937 0%, #374151 100%)";
  return (
    <Link href={`/t/${trip.share_token}`} className="block tap-active">
      <div className="rounded-[28px] overflow-hidden relative" style={{ background: bg, opacity: status === "completed" ? 0.72 : 1 }}>
        <CardBg c1="rgba(255,255,255,0.06)" c2="rgba(255,255,255,0.04)" />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[80px] leading-none select-none" style={{ opacity: 0.7 }}>✈️</div>
        <div className="relative px-6 pt-7 pb-6" style={{ minHeight: 160 }}>
          <div className="mb-4">
            {status === "upcoming" && <span className="text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>In {days} days</span>}
            {status === "completed" && <span className="text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>Completed</span>}
          </div>
          <h2 className="text-[22px] font-black text-white leading-tight mb-1.5" style={{ maxWidth: "65%" }}>{trip.name}</h2>
          {trip.destination && <p className="text-[11px] mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>{trip.destination}</p>}
          <div className="flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14 }}>
            <p className="text-[12px] font-bold text-white">{fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}</p>
            <div className="px-4 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
              <span className="text-[12px] font-bold text-white">View →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Profile bottom sheet ── */
function ProfileSheet({ open, onClose }: {
  open: boolean; onClose: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-50 w-full rounded-t-[32px] pb-10"
        style={{ maxWidth: 430, transform: "translateX(-50%)", background: "#fff" }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-10 h-1 rounded-full" style={{ background: "#e5e7eb" }} />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 px-6 pb-5 mb-2" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-[20px]"
            style={{ background: "#1a2744" }}>H</div>
          <div>
            <p className="text-[17px] font-bold text-[#111827]">Howztrip</p>
            <p className="text-[12px] mt-0.5" style={{ color: "#9ca3af" }}>Your trip, answered.</p>
          </div>
        </div>

        {/* My Documents wallet */}
        <div className="py-2" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <MyDocuments />
        </div>

        {/* Menu items */}
        {[
          { icon: Bell, label: "Notifications", sub: "Trip alerts & updates" },
          { icon: Share2, label: "Share Howztrip", sub: "Invite friends & family" },
          { icon: HelpCircle, label: "Help & Support", sub: "FAQs and contact us" },
          { icon: User, label: "Account settings", sub: "Manage your profile" },
        ].map(({ icon: Icon, label, sub }) => (
          <button key={label} className="w-full flex items-center gap-4 px-6 py-4 tap-active"
            style={{ borderBottom: "1px solid #f9fafb" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "#f7f7f5" }}>
              <Icon size={17} style={{ color: "#374151" }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-semibold text-[#111827]">{label}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{sub}</p>
            </div>
            <ChevronRight size={16} style={{ color: "#d1d5db" }} />
          </button>
        ))}

      </div>
    </>
  );
}

/* ── Page ── */
export default function HomePage() {
  const [userTrips, setUserTrips] = useState<UserTrip[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => { setUserTrips(getUserTrips()); }, []);

  const active   = trips.filter(t => t.status === "active");
  const upcoming = trips.filter(t => t.status === "upcoming");
  const completed = trips.filter(t => t.status === "completed");

  return (
    <main className="min-h-dvh" style={{ background: "#f0efeb" }}>
      {/* Top nav */}
      <div className="flex items-center justify-between px-5 pb-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}>
        <Image src="/howztrip.svg" alt="Howztrip" width={110} height={26} />
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#fff" }}>
            <Bell size={17} style={{ color: "#6b7280" }} />
          </button>
          <button onClick={() => setProfileOpen(true)} className="tap-active">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-[14px]"
              style={{ background: "#1a2744" }}>
              P
            </div>
          </button>
        </div>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <section className="px-4 mb-5">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: "#9ca3af" }}>Active now</p>
          <div className="flex flex-col gap-3">{active.map(t => <HeroTripCard key={t.id} trip={t} />)}</div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="px-4 mb-5">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: "#9ca3af" }}>Coming up</p>
          <div className="flex flex-col gap-3">{upcoming.map(t => <HeroTripCard key={t.id} trip={t} />)}</div>
        </section>
      )}

      {/* User trips */}
      {userTrips.length > 0 && (
        <section className="px-4 mb-5">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: "#9ca3af" }}>My trips</p>
          <div className="flex flex-col gap-3">{userTrips.map(t => <UserHeroCard key={t.id} trip={t} />)}</div>
        </section>
      )}

      {/* Past trips */}
      {completed.length > 0 && (
        <section className="px-4 mb-5">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: "#9ca3af" }}>Past trips</p>
          <div className="flex flex-col gap-2">{completed.map(t => <CompactTripCard key={t.id} trip={t} />)}</div>
        </section>
      )}

      {/* Create trip CTA */}
      <div className="px-4 mt-2 mb-12">
        <Link href="/create" className="block tap-active">
          <div className="rounded-[24px] px-5 py-5 flex items-center gap-4"
            style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "#f0f4ff" }}>
              <Plus size={20} style={{ color: "#2563eb" }} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#111827]">Plan your own trip</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>Upload bookings · AI builds itinerary · Share link</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Profile sheet */}
      <ProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} />
    </main>
  );
}
