"use client";

import Link from "next/link";
import { MapPin, Users, Calendar, Bell, Plus } from "lucide-react";
import { trips, TripSummary } from "@/lib/trips";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

const tripColors: Record<string, { bg: string; emoji: string }> = {
  "kashmir-2026": { bg: "linear-gradient(135deg, #1a2744 0%, #1e3a6e 100%)", emoji: "🏔️" },
  "goa-2026": { bg: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)", emoji: "🌊" },
  "rajasthan-2025": { bg: "linear-gradient(135deg, #92400e 0%, #f97316 100%)", emoji: "🏰" },
};

function TripCard({ trip }: { trip: TripSummary }) {
  const days = daysUntil(trip.start_date);
  const style = tripColors[trip.id] ?? { bg: "linear-gradient(135deg, #374151, #6b7280)", emoji: "✈️" };
  const isCompleted = trip.status === "completed";

  return (
    <Link href={`/trip/${trip.id}`} className="block tap-active">
      <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
        <div className="px-5 pt-5 pb-6 relative" style={{ background: style.bg, opacity: isCompleted ? 0.75 : 1 }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {trip.status === "active" && (
                  <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.3)", border: "1px solid rgba(34,197,94,0.5)" }}>
                    🟢 Live now
                  </span>
                )}
                {trip.status === "upcoming" && days > 0 && (
                  <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }}>
                    In {days} days
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)" }}>
                    Completed
                  </span>
                )}
              </div>
              <h2 className="text-[20px] font-bold text-white leading-tight">{trip.name}</h2>
              <div className="flex items-center gap-1 mt-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                <MapPin size={10} />
                <p className="text-[11px]">{trip.destination}</p>
              </div>
            </div>
            <span className="text-[38px] leading-none ml-3">{style.emoji}</span>
          </div>
        </div>
        <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: "#fff" }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" style={{ color: "#9ca3af" }}>
              <Calendar size={11} />
              <span className="text-[11px]">{formatDate(trip.start_date)}</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "#9ca3af" }}>
              <Users size={11} />
              <span className="text-[11px]">{trip.group_size} travellers</span>
            </div>
          </div>
          <span className="text-[12px] font-bold" style={{ color: "#2563eb" }}>
            {trip.status === "active" ? "Open →" : trip.status === "upcoming" ? "View →" : "Details →"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const active = trips.filter((t) => t.status === "active");
  const upcoming = trips.filter((t) => t.status === "upcoming");
  const completed = trips.filter((t) => t.status === "completed");

  return (
    <main className="min-h-dvh flex flex-col" style={{ background: "#f7f7f5" }}>
      {/* App header */}
      <div className="px-5 pt-14 pb-2 flex items-start justify-between">
        <div>
          <img src="/triphost.svg" alt="TripHost" style={{ height: 22, marginBottom: 4 }} />
          <h1 className="text-[28px] font-black text-[#111827]">My Trips</h1>
        </div>
        <button className="w-10 h-10 rounded-2xl flex items-center justify-center mt-2" style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <Bell size={18} style={{ color: "#6b7280" }} />
        </button>
      </div>

      {/* Active trip — full-width hero if exists */}
      {active.length > 0 && (
        <div className="px-4 mt-4 mb-2">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2.5" style={{ color: "#9ca3af" }}>Active now</p>
          <div className="flex flex-col gap-3">{active.map(t => <TripCard key={t.id} trip={t} />)}</div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="px-4 mt-4 mb-2">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2.5" style={{ color: "#9ca3af" }}>Coming up</p>
          <div className="flex flex-col gap-3">{upcoming.map(t => <TripCard key={t.id} trip={t} />)}</div>
        </div>
      )}

      {/* Past */}
      {completed.length > 0 && (
        <div className="px-4 mt-4 mb-2">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2.5" style={{ color: "#9ca3af" }}>Past trips</p>
          <div className="flex flex-col gap-3">{completed.map(t => <TripCard key={t.id} trip={t} />)}</div>
        </div>
      )}

      {/* Floating invite banner */}
      <div className="px-4 mt-6 mb-8">
        <div className="rounded-3xl px-5 py-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #1a2744, #1e3a6e)" }}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
            <Plus size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white">Have a trip coming up?</p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Ask your operator to add you on TripHost</p>
          </div>
        </div>
      </div>
    </main>
  );
}
