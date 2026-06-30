"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Plus, Bell, ChevronRight, HelpCircle, Share2, User } from "lucide-react";
import { TripSummary } from "@/lib/trips";
import MyDocuments from "@/components/MyDocuments";

interface DbTrip {
  slug: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  role: string;
}

function dbTripToSummary(t: DbTrip): TripSummary {
  const today = new Date().toISOString().split("T")[0];
  const status = today < t.startDate ? "upcoming" : today > t.endDate ? "completed" : "active";
  return {
    id: t.slug,
    name: t.name,
    destination: t.destination,
    start_date: t.startDate,
    end_date: t.endDate,
    group_size: 0,
    organizer: "",
    status,
    cover_emoji: "✈️",
  };
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const TRIP_META: Record<string, { accent: string; iconBg: string; emoji: string }> = {
  "kashmir-2026":   { accent: "#1a3a7a", iconBg: "#e8eef8", emoji: "🏔️" },
  "goa-2026":       { accent: "#0369a1", iconBg: "#e0f2fe", emoji: "🌊" },
  "rajasthan-2025": { accent: "#c2410c", iconBg: "#fff0e8", emoji: "🏰" },
};
const DEFAULT_META = { accent: "#374151", iconBg: "#f3f4f6", emoji: "✈️" };

function HeroTripCard({ trip }: { trip: TripSummary }) {
  const m = TRIP_META[trip.id] ?? DEFAULT_META;
  const days = daysUntil(trip.start_date);
  const hasImage = !!trip.cover_image;

  return (
    <Link href={`/trip/${trip.id}`} className="block tap-active">
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
        {/* Cover image */}
        {hasImage ? (
          <div className="relative" style={{ height: 160 }}>
            <img src={trip.cover_image} alt={trip.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%)" }} />
            {/* Status badge over image */}
            <div style={{ position: "absolute", top: 12, right: 12 }}>
              {trip.status === "active" && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(22,163,74,0.9)", color: "#fff" }}>🟢 Live</span>
              )}
              {trip.status === "upcoming" && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.92)", color: m.accent }}>In {days} days</span>
              )}
            </div>
            {/* Trip name over image */}
            <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
              <h2 className="text-[20px] font-black text-white leading-tight">{trip.name}</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} strokeWidth={2} style={{ color: "rgba(255,255,255,0.7)" }} />
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>{trip.destination}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="h-1 w-full" style={{ background: m.accent }} />
            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0"
                  style={{ background: m.iconBg }}>{m.emoji}</div>
                <div>
                  <h2 className="text-[17px] font-black" style={{ color: "#111827" }}>{trip.name}</h2>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} strokeWidth={2} style={{ color: "#9ca3af" }} />
                    <p className="text-[11px]" style={{ color: "#9ca3af" }}>{trip.destination}</p>
                  </div>
                </div>
              </div>
              {trip.status === "active" && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: "#dcfce7", color: "#16a34a" }}>Live</span>}
              {trip.status === "upcoming" && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: "#eff6ff", color: m.accent }}>In {days}d</span>}
            </div>
          </>
        )}
        {/* Footer */}
        <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderTop: "1px solid #f3f4f6" }}>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#d1d5db" }}>Dates</p>
              <p className="text-[12px] font-semibold" style={{ color: "#374151" }}>{fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#d1d5db" }}>Group</p>
              <p className="text-[12px] font-semibold" style={{ color: "#374151" }}>{trip.group_size} travellers</p>
            </div>
          </div>
          <span className="text-[12px] font-bold" style={{ color: m.accent }}>
            {trip.status === "active" ? "Open" : "View"} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function CompactTripCard({ trip }: { trip: TripSummary }) {
  const m = TRIP_META[trip.id] ?? DEFAULT_META;
  return (
    <Link href={`/trip/${trip.id}`} className="block tap-active">
      <div className="rounded-2xl flex items-center gap-3.5 px-4 py-3.5"
        style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] shrink-0"
          style={{ background: m.iconBg }}>
          {m.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold leading-tight truncate" style={{ color: "#111827" }}>{trip.name}</p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "#9ca3af" }}>
            {fmtDate(trip.start_date)} · {trip.group_size} travellers
          </p>
        </div>
        <span className="text-[11px] font-semibold shrink-0" style={{ color: "#9ca3af" }}>Details →</span>
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
  const [allTrips, setAllTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/my-trips")
      .then(r => r.ok ? r.json() : { trips: [] })
      .then(data => setAllTrips((data.trips as DbTrip[]).map(dbTripToSummary)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active    = allTrips.filter(t => t.status === "active");
  const upcoming  = allTrips.filter(t => t.status === "upcoming");
  const completed = allTrips.filter(t => t.status === "completed");

  return (
    <main className="min-h-dvh" style={{ background: "#f7f7f5" }}>
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

      {/* Loading */}
      {loading && (
        <div className="px-4 mb-5">
          {[1,2].map(i => (
            <div key={i} className="rounded-2xl mb-3 animate-pulse" style={{ height: 120, background: "#e5e7eb" }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && allTrips.length === 0 && (
        <div className="px-4 py-16 flex flex-col items-center text-center">
          <p className="text-[40px] mb-4">✈️</p>
          <p className="text-[16px] font-bold text-[#111827]">No trips yet</p>
          <p className="text-[13px] mt-1" style={{ color: "#9ca3af" }}>Your operator will add you to a trip</p>
        </div>
      )}

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
