"use client";

import { useState, useEffect } from "react";
import { Phone, MapPin, AlertTriangle, CheckCircle2, Navigation, Wind, Droplets } from "lucide-react";
import { Trip } from "@/lib/types";

/* ── Dev phase override ── */
let _dateOverride: string | null = null;
function today() { return _dateOverride ?? new Date().toISOString().split("T")[0]; }
function todayHour() { return new Date().getHours(); }
function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - (_dateOverride ? new Date(_dateOverride) : new Date()).getTime()) / 86400000); }
function fmt(d: string) { return new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }); }

const PHASE_DATES = [
  { label: "Pre-trip", date: "2026-05-10" },
  { label: "Departure", date: "2026-05-17" },
  { label: "In-trip", date: "2026-05-20" },
  { label: "Return", date: "2026-05-25" },
  { label: "Post-trip", date: "2026-06-01" },
];

function PhaseSwitcher({ active, onChange }: { active: number; onChange: (i: number) => void }) {
  return (
    <div className="mx-4 mb-3 rounded-2xl overflow-hidden flex" style={{ background: "#1a2744" }}>
      {PHASE_DATES.map((p, i) => (
        <button key={i} onClick={() => onChange(i)}
          className="flex-1 py-2 text-[10px] font-bold tap-active"
          style={{ color: i === active ? "#fff" : "rgba(255,255,255,0.35)", background: i === active ? "rgba(255,255,255,0.15)" : "transparent" }}>
          {p.label}
        </button>
      ))}
    </div>
  );
}

type TripPhase =
  | { type: "pre-trip"; daysUntil: number }
  | { type: "departure-day" }
  | { type: "in-trip"; day: number; total: number; title: string; description: string; isLastDay: boolean }
  | { type: "return-day" }
  | { type: "post-trip" };

function getTripPhase(trip: Trip): TripPhase {
  const t = today();
  const days = daysUntil(trip.start_date);
  if (t < trip.start_date) return { type: "pre-trip", daysUntil: days };
  if (t === trip.start_date) return { type: "departure-day" };
  if (t === trip.end_date) return { type: "return-day" };
  if (t > trip.end_date) return { type: "post-trip" };
  const current = trip.itinerary.find(d => d.date === t);
  if (current) return { type: "in-trip", day: current.day, total: trip.itinerary.length, title: current.title, description: current.description, isLastDay: current.day === trip.itinerary.length };
  return { type: "post-trip" };
}

/* ── Shared ── */
function DriverCard({ trip }: { trip: Trip }) {
  return (
    <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Your driver</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-[20px] shrink-0" style={{ background: "#1a2744" }}>
          {trip.driver.name.split(" ").pop()?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[#111827]">{trip.driver.name}</p>
          <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{trip.driver.vehicle_type}</p>
          <p className="text-[11px] font-mono font-bold mt-0.5" style={{ color: "#6b7280" }}>{trip.driver.vehicle_number}</p>
        </div>
        <a href={`tel:${trip.driver.phone}`} className="flex items-center gap-1.5 text-white text-[13px] font-bold px-5 py-2.5 rounded-2xl tap-active shrink-0" style={{ background: "#16a34a" }}>
          <Phone size={14} /> Call
        </a>
      </div>
    </div>
  );
}

function SOSBar({ trip }: { trip: Trip }) {
  const emergency = trip.contacts[0];
  return (
    <div className="mx-4 mb-4 flex gap-2">
      <a href={`tel:${trip.driver.phone}`}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl tap-active font-bold text-[12px]"
        style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", color: "#111827", border: "1px solid #e5e7eb" }}>
        <Phone size={14} style={{ color: "#16a34a" }} /> Driver
      </a>
      <a href={`tel:${emergency?.phone}`}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl tap-active font-bold text-[12px]"
        style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", color: "#111827", border: "1px solid #e5e7eb" }}>
        <Phone size={14} style={{ color: "#0369a1" }} /> Operator
      </a>
      <a href={`tel:${emergency?.phone}`}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl tap-active font-bold text-[12px]"
        style={{ background: "#e11d48", color: "#fff" }}>
        <AlertTriangle size={14} /> SOS
      </a>
    </div>
  );
}

/* ── Weather widget ── */
type Weather = { temp: number; desc: string; icon: string; humidity: number; wind: number };

function WeatherWidget({ city }: { city: string }) {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
    if (!apiKey) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
      .then(r => r.json())
      .then(d => {
        if (d.main) setWeather({
          temp: Math.round(d.main.temp),
          desc: d.weather[0].description,
          icon: d.weather[0].icon,
          humidity: d.main.humidity,
          wind: Math.round(d.wind.speed),
        });
      })
      .catch(() => {});
  }, [city]);

  if (!weather) return null;

  return (
    <div className="mx-4 rounded-3xl px-5 py-4 mb-4 flex items-center gap-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.desc} width={52} height={52} />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#9ca3af" }}>{city} · Now</p>
        <p className="text-[26px] font-black text-[#111827] leading-none">{weather.temp}°C</p>
        <p className="text-[12px] mt-0.5 capitalize" style={{ color: "#6b7280" }}>{weather.desc}</p>
      </div>
      <div className="flex flex-col gap-1.5 text-right">
        <div className="flex items-center gap-1 justify-end" style={{ color: "#9ca3af" }}>
          <Droplets size={12} /><span className="text-[11px]">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 justify-end" style={{ color: "#9ca3af" }}>
          <Wind size={12} /><span className="text-[11px]">{weather.wind} m/s</span>
        </div>
      </div>
    </div>
  );
}

/* ── Pre-trip ── */
function PreTripScreen({ trip, phase }: { trip: Trip; phase: Extract<TripPhase, { type: "pre-trip" }> }) {
  const onward = trip.flights.find(f => f.type === "onward");
  const checklist = [
    { label: "Valid ID / Aadhaar or Passport", done: true },
    { label: "Flight tickets saved in app", done: true },
    { label: "Hotel list saved offline", done: true },
    { label: "Emergency contacts saved", done: false },
    { label: "Travel insurance", done: false },
    { label: "Cash + UPI ready", done: true },
  ];
  return (
    <>
      <div className="mx-4 rounded-4xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #1a2744 0%, #1e3a6e 100%)", boxShadow: "0 8px 32px rgba(26,39,68,0.25)" }}>
        <div className="px-6 pt-7 pb-6">
          <p className="text-[11px] font-bold tracking-[2px] uppercase mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Your trip starts in</p>
          <p className="text-[72px] font-black text-white leading-none">{phase.daysUntil}</p>
          <p className="text-[20px] font-bold text-white mt-1">days to go ✈️</p>
          <p className="text-[12px] mt-3" style={{ color: "rgba(255,255,255,0.45)" }}>{fmt(trip.start_date)}</p>
        </div>
        {onward && (
          <div className="mx-4 mb-5 rounded-3xl px-5 py-4" style={{ background: "rgba(255,255,255,0.08)" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>First flight · {onward.pnr}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[26px] font-black text-white">{onward.from.split(" ")[0]}</p>
                <p className="text-[13px] font-bold text-white">{onward.departure}</p>
              </div>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>✈ via {onward.via}</p>
              <div className="text-right">
                <p className="text-[26px] font-black text-white">{onward.to.split(" ")[0]}</p>
                <p className="text-[13px] font-bold text-white">{onward.arrival}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Day 1 · On arrival at {onward?.to.split(" ")[0]}</p>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
            <Navigation size={15} style={{ color: "#2563eb" }} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#111827]">Your driver will meet you</p>
            <p className="text-[12px] mt-0.5" style={{ color: "#6b7280" }}>At airport arrivals with your name sign</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#f7f7f5" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-[16px] shrink-0" style={{ background: "#1a2744" }}>
            {trip.driver.name.split(" ").pop()?.[0]}
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-[#111827]">{trip.driver.name}</p>
            <p className="text-[11px]" style={{ color: "#9ca3af" }}>{trip.driver.vehicle_type} · {trip.driver.vehicle_number}</p>
          </div>
          <a href={`tel:${trip.driver.phone}`} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#16a34a" }}>
            <Phone size={14} className="text-white" />
          </a>
        </div>
      </div>

      <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Pre-trip checklist</p>
        {checklist.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < checklist.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <CheckCircle2 size={18} style={{ color: item.done ? "#16a34a" : "#d1d5db", flexShrink: 0 }} />
            <p className="text-[13px]" style={{ color: item.done ? "#111827" : "#9ca3af" }}>{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Trip overview</p>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Days", value: trip.itinerary.length }, { label: "Travellers", value: trip.group_size }, { label: "Hotels", value: trip.hotels.length }].map((s, i) => (
            <div key={i} className="rounded-2xl px-3 py-3 text-center" style={{ background: "#f7f7f5" }}>
              <p className="text-[24px] font-black text-[#111827]">{s.value}</p>
              <p className="text-[10px] font-bold" style={{ color: "#9ca3af" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Departure day ── */
function DepartureDayScreen({ trip }: { trip: Trip }) {
  const onward = trip.flights.find(f => f.type === "onward");
  return (
    <>
      <div className="mx-4 rounded-4xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", boxShadow: "0 8px 32px rgba(22,163,74,0.3)" }}>
        <div className="px-6 pt-7 pb-7">
          <p className="text-[11px] font-bold tracking-[2px] uppercase mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Today is the day!</p>
          <p className="text-[32px] font-black text-white leading-tight">Your Kashmir<br />adventure begins 🏔️</p>
          <p className="text-[13px] mt-3" style={{ color: "rgba(255,255,255,0.65)" }}>{fmt(trip.start_date)}</p>
        </div>
      </div>
      {onward && (
        <div className="mx-4 rounded-3xl overflow-hidden mb-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div className="px-5 py-5" style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>Your flight today</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[40px] font-black text-white leading-none">{onward.departure}</p>
                <p className="text-[15px] font-bold text-white mt-1">{onward.from.split(" ")[0]}</p>
              </div>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>✈ via {onward.via}</p>
              <div className="text-right">
                <p className="text-[40px] font-black text-white leading-none">{onward.arrival}</p>
                <p className="text-[15px] font-bold text-white mt-1">{onward.to.split(" ")[0]}</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#fff" }}>
            <p className="text-[13px] font-bold text-[#111827]">PNR: {onward.pnr}</p>
            <p className="text-[12px]" style={{ color: "#9ca3af" }}>Be at airport 2hrs early</p>
          </div>
        </div>
      )}
      <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>What to do right now</p>
        {[
          { icon: "🪪", text: "Carry valid ID — Aadhaar or Passport" },
          { icon: "🎒", text: "Baggage: 15 kg check-in + 7 kg cabin per person" },
          { icon: "📱", text: "Keep this app open — everything is here" },
          { icon: "🤝", text: "Driver meets you at Srinagar arrivals with name sign" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <span className="text-xl shrink-0">{item.icon}</span>
            <p className="text-[13px] text-[#111827]">{item.text}</p>
          </div>
        ))}
      </div>
      <DriverCard trip={trip} />
    </>
  );
}

/* ── In-trip ── */
function InTripScreen({ trip, phase }: { trip: Trip; phase: Extract<TripPhase, { type: "in-trip" }> }) {
  const t = today();
  const isEvening = todayHour() >= 17;
  const hotel = trip.hotels.find(h => h.check_in <= t && t < h.check_out);
  const nextHotel = trip.hotels.find(h => h.check_in > t);
  const isCheckoutDay = hotel?.check_out === t;
  const gondola = trip.tickets.find(tk => tk.date === t);

  return (
    <>
      <div className="mx-4 rounded-4xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #1a2744 0%, #1e3a6e 100%)", boxShadow: "0 8px 32px rgba(26,39,68,0.25)" }}>
        <div className="px-6 pt-7 pb-6">
          <span className="text-[10px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded-full inline-block mb-3" style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80" }}>
            🟢 Day {phase.day} of {phase.total}
          </span>
          <h2 className="text-[22px] font-black text-white leading-snug mb-2">{phase.title}</h2>
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{phase.description}</p>
          <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>{fmt(t)}</p>
        </div>
      </div>

      <WeatherWidget city={hotel?.location ?? trip.destination.split(" · ")[0]} />

      {gondola && (
        <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", boxShadow: "0 4px 20px rgba(251,191,36,0.3)" }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚡</span>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>Today&apos;s activity</p>
              <p className="text-[16px] font-black text-[#111827]">{gondola.activity}</p>
              <p className="text-[12px] font-bold mt-0.5 text-[#111827]">🕐 {gondola.slot}</p>
            </div>
          </div>
        </div>
      )}

      {isCheckoutDay && hotel && (
        <div className="mx-4 rounded-3xl px-5 py-4 mb-4 flex items-center gap-3" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
          <AlertTriangle size={20} style={{ color: "#f97316", flexShrink: 0 }} />
          <div>
            <p className="text-[13px] font-bold" style={{ color: "#c2410c" }}>Checkout today by 11:00 AM</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>Moving to {nextHotel?.name ?? "next hotel"}</p>
          </div>
        </div>
      )}

      {hotel && (
        <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>
            {isCheckoutDay ? "Last night here" : "Tonight's stay"}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-bold text-[#111827]">{hotel.name}</p>
              <div className="flex items-center gap-1 mt-1" style={{ color: "#9ca3af" }}>
                <MapPin size={11} /><p className="text-[11px]">{hotel.location}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{hotel.room_type}</span>
                <span className="text-[10px]" style={{ color: "#9ca3af" }}>🍽 {hotel.meal_plan}</span>
              </div>
            </div>
            <a href={`tel:${hotel.phone}`} className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#16a34a" }}>
              <Phone size={15} className="text-white" />
            </a>
          </div>
        </div>
      )}

      {isEvening && !phase.isLastDay && (() => {
        const tomorrow = trip.itinerary.find(d => d.day === phase.day + 1);
        const tmrHotel = trip.hotels.find(h => tomorrow && h.check_in === tomorrow.date);
        return tomorrow ? (
          <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Tomorrow — Day {phase.day + 1}</p>
            <p className="text-[15px] font-bold text-[#111827]">{tomorrow.title}</p>
            <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "#6b7280" }}>{tomorrow.description}</p>
            {tmrHotel && (
              <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <span className="text-base">🏨</span>
                <p className="text-[12px]" style={{ color: "#9ca3af" }}>Checking into {tmrHotel.name}, {tmrHotel.location}</p>
              </div>
            )}
          </div>
        ) : null;
      })()}

      <DriverCard trip={trip} />
    </>
  );
}

/* ── Return day ── */
function ReturnDayScreen({ trip }: { trip: Trip }) {
  const returnFlight = trip.flights.find(f => f.type === "return");
  return (
    <>
      <div className="mx-4 rounded-4xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", boxShadow: "0 8px 32px rgba(79,70,229,0.3)" }}>
        <div className="px-6 pt-7 pb-7">
          <p className="text-[11px] font-bold tracking-[2px] uppercase mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>Last day · Time to head home</p>
          <p className="text-[28px] font-black text-white leading-tight">Safe travels! 🙏<br />See you again.</p>
        </div>
      </div>

      {returnFlight && (
        <div className="mx-4 rounded-3xl overflow-hidden mb-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div className="px-5 py-5" style={{ background: "linear-gradient(135deg, #312e81, #4f46e5)" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>Your return flight</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[40px] font-black text-white leading-none">{returnFlight.departure}</p>
                <p className="text-[15px] font-bold text-white mt-1">{returnFlight.from.split(" ")[0]}</p>
              </div>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>✈ via {returnFlight.via}</p>
              <div className="text-right">
                <p className="text-[40px] font-black text-white leading-none">{returnFlight.arrival}</p>
                <p className="text-[15px] font-bold text-white mt-1">{returnFlight.to.split(" ")[0]}</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#fff" }}>
            <p className="text-[13px] font-bold text-[#111827]">PNR: {returnFlight.pnr}</p>
            <p className="text-[12px]" style={{ color: "#9ca3af" }}>Be at airport 2hrs early</p>
          </div>
        </div>
      )}

      <div className="mx-4 rounded-3xl px-5 py-4 mb-4" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Before you leave</p>
        {["🛄 Check out of hotel by 11:00 AM", "🪪 Keep ID and boarding pass ready", "🧳 Check you have all your belongings", "🤝 Driver will drop you to airport"].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <span className="text-xl shrink-0">{item.slice(0, 2)}</span>
            <p className="text-[13px] text-[#111827]">{item.slice(3)}</p>
          </div>
        ))}
      </div>

      <DriverCard trip={trip} />

      <div className="mx-4 rounded-3xl px-5 py-5 mb-4 text-center" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-[22px] mb-2">⭐️⭐️⭐️⭐️⭐️</p>
        <p className="text-[15px] font-bold text-[#111827]">How was your trip?</p>
        <p className="text-[12px] mt-1 mb-4" style={{ color: "#9ca3af" }}>Your feedback helps future travellers</p>
        <div className="flex gap-2">
          {["😞", "😐", "🙂", "😄", "🤩"].map((emoji, i) => (
            <button key={i} className="flex-1 py-3 rounded-2xl text-xl tap-active" style={{ background: "#f7f7f5" }}>{emoji}</button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Post-trip ── */
function PostTripScreen({ trip }: { trip: Trip }) {
  return (
    <>
      <div className="mx-4 rounded-4xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #92400e 0%, #f97316 100%)", boxShadow: "0 8px 32px rgba(249,115,22,0.25)" }}>
        <div className="px-6 pt-7 pb-7">
          <p className="text-[40px] mb-2">🏔️</p>
          <p className="text-[28px] font-black text-white leading-tight">What a trip!</p>
          <p className="text-[13px] mt-2" style={{ color: "rgba(255,255,255,0.6)" }}>{trip.name} · {trip.itinerary.length} days · {trip.group_size} travellers</p>
        </div>
      </div>
      <div className="mx-4 rounded-3xl px-5 py-5 mb-4 text-center" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-[15px] font-bold text-[#111827] mb-1">Rate your experience</p>
        <p className="text-[12px] mb-4" style={{ color: "#9ca3af" }}>Help {trip.organizer} improve future trips</p>
        <div className="flex gap-2 mb-4">
          {["😞", "😐", "🙂", "😄", "🤩"].map((emoji, i) => (
            <button key={i} className="flex-1 py-3 rounded-2xl text-xl tap-active" style={{ background: "#f7f7f5" }}>{emoji}</button>
          ))}
        </div>
        <button className="w-full py-3.5 rounded-2xl font-bold text-[14px] text-white tap-active" style={{ background: "#1a2744" }}>
          Book next trip with {trip.organizer}
        </button>
      </div>
    </>
  );
}

/* ── Main ── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HomeScreen({ trip, onTabChange }: { trip: Trip; onTabChange?: (tab: import("../ui/BottomNav").Tab) => void }) {
  const [phaseIdx, setPhaseIdx] = useState<number | null>(null);

  if (phaseIdx !== null) {
    _dateOverride = PHASE_DATES[phaseIdx].date;
  } else {
    _dateOverride = null;
  }

  const phase = getTripPhase(trip);

  function handlePhaseChange(i: number) {
    setPhaseIdx(i);
  }

  return (
    <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
      <div className="px-5 pt-12 pb-5">
        <p className="text-[11px] font-bold tracking-[2px] uppercase mb-1" style={{ color: "#9ca3af" }}>{trip.organizer}</p>
        <h1 className="text-[26px] font-bold text-[#111827]">{trip.name}</h1>
        <p className="text-[12px] mt-0.5 flex items-center gap-1" style={{ color: "#9ca3af" }}>
          <MapPin size={11} />{trip.destination}
        </p>
      </div>

      {/* Dev phase switcher */}
      <PhaseSwitcher active={phaseIdx ?? 4} onChange={handlePhaseChange} />

      {(phase.type === "in-trip" || phase.type === "departure-day" || phase.type === "return-day") && (
        <SOSBar trip={trip} />
      )}

      {phase.type === "pre-trip" && <PreTripScreen trip={trip} phase={phase} />}
      {phase.type === "departure-day" && <DepartureDayScreen trip={trip} />}
      {phase.type === "in-trip" && <InTripScreen trip={trip} phase={phase} />}
      {phase.type === "return-day" && <ReturnDayScreen trip={trip} />}
      {phase.type === "post-trip" && <PostTripScreen trip={trip} />}

      <div className="h-4" />
    </div>
  );
}
