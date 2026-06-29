"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, MapPin, AlertTriangle, CheckCircle2, Navigation, PhoneCall, Wifi } from "lucide-react";
import { Trip, Hotel } from "@/lib/types";
import { notifications } from "@/lib/notifications";
import { getPlacesForLocation } from "@/lib/places";

/* ── Date utils ── */
let _dateOverride: string | null = null;
function today() { return _dateOverride ?? new Date().toISOString().split("T")[0]; }
function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - (_dateOverride ? new Date(_dateOverride) : new Date()).getTime()) / 86400000); }
function fmt(d: string) { return new Date(d + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }); }
function fmtShort(d: string) { return new Date(d + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }); }
function nightsBetween(a: string, b: string) { return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000); }

/* ── Day Strip ── */
type StripItem = { key: string; top: string; bottom: string; date: string; hasDot?: boolean };

function DayStrip({ trip, overrideDate, onChange }: { trip: Trip; overrideDate: string | null; onChange: (d: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const items: StripItem[] = [
    { key: "pre", top: "PRE", bottom: "Trip", date: "2026-05-10" },
    ...trip.itinerary.map(d => ({
      key: d.date,
      top: new Date(d.date + "T12:00:00").getDate().toString(),
      bottom: new Date(d.date + "T12:00:00").toLocaleDateString("en", { month: "short" }),
      date: d.date,
      hasDot: trip.passes.some(p => p.date === d.date && p.type !== "flight") || notifications.some(n => n.date === d.date),
    })),
    { key: "post", top: "POST", bottom: "Home", date: "2026-06-01" },
  ];

  const effectiveDate = overrideDate ?? today();
  const selectedKey = items.find(i => i.date === effectiveDate)?.key;

  useEffect(() => {
    if (!scrollRef.current || !selectedKey) return;
    const el = scrollRef.current.querySelector(`[data-key="${selectedKey}"]`) as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedKey]);

  return (
    <div className="mb-1" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <div ref={scrollRef} className="overflow-x-auto scroll-hide flex gap-2 px-4 pb-4 pt-1">
        {items.map(item => {
          const active = item.key === selectedKey;
          const isWord = item.key === "pre" || item.key === "post";
          return (
            <button key={item.key} data-key={item.key} onClick={() => onChange(item.date)}
              className="flex flex-col items-center shrink-0 tap-active" style={{ minWidth: 48 }}>
              <div className="w-12 rounded-2xl flex flex-col items-center justify-center gap-0.5"
                style={{ height: 54, background: active ? "#1a2744" : "#efefef" }}>
                <span className="font-black leading-none"
                  style={{ fontSize: isWord ? 8 : 20, color: active ? "#fff" : "#374151", letterSpacing: isWord ? 0.5 : 0 }}>
                  {item.top}
                </span>
                <span style={{ fontSize: 9, fontWeight: 600, color: active ? "rgba(255,255,255,0.55)" : "#9ca3af" }}>
                  {item.bottom}
                </span>
              </div>
              <div className="h-2.5 flex items-center justify-center">
                {item.hasDot && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: active ? "#1a2744" : "#d1d5db" }} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Phase logic ── */
type TripPhase =
  | { type: "pre-trip"; daysUntil: number }
  | { type: "departure-day" }
  | { type: "in-trip"; day: number; total: number; title: string; description: string; isLastDay: boolean }
  | { type: "return-day" }
  | { type: "post-trip" };

function getTripPhase(trip: Trip): TripPhase {
  const t = today();
  if (t < trip.start_date) return { type: "pre-trip", daysUntil: daysUntil(trip.start_date) };
  if (t === trip.start_date) return { type: "departure-day" };
  if (t === trip.end_date) return { type: "return-day" };
  if (t > trip.end_date) return { type: "post-trip" };
  const current = trip.itinerary.find(d => d.date === t);
  if (current) return { type: "in-trip", day: current.day, total: trip.itinerary.length, title: current.title, description: current.description, isLastDay: current.day === trip.itinerary.length };
  return { type: "post-trip" };
}

/* ── Weather hook ── */
type Weather = { temp: number; desc: string; icon: string; humidity: number; wind: number };

function useWeather(city: string) {
  const [weather, setWeather] = useState<Weather | null>(null);
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
    if (!apiKey) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
      .then(r => r.json())
      .then(d => { if (d.main) setWeather({ temp: Math.round(d.main.temp), desc: d.weather[0].description, icon: d.weather[0].icon, humidity: d.main.humidity, wind: Math.round(d.wind.speed) }); })
      .catch(() => {});
  }, [city]);
  return weather;
}

/* ── Shared ── */
function DriverCard({ trip }: { trip: Trip }) {
  return (
    <div className="mx-4 rounded-2xl px-5 py-4 mb-4" style={{ background: "#fff" }}>
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

/* ── Day updates feed ── */
const DOT_COLORS: Record<string, string> = { success: "#22c55e", warning: "#f59e0b", info: "#2563eb", neutral: "#d1d5db" };

function DayUpdatesFeed({ date, organizer }: { date: string; organizer: string }) {
  const items = notifications.filter(n => n.date === date);
  if (items.length === 0) return null;
  return (
    <div className="mx-4 mb-4 rounded-2xl px-5 py-4" style={{ background: "#fff" }}>
      <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>From {organizer}</p>
      <div className="flex flex-col gap-3">
        {items.map((n, i) => (
          <div key={n.id} className="flex gap-3"
            style={{ paddingBottom: i < items.length - 1 ? 12 : 0, borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: DOT_COLORS[n.type] ?? "#d1d5db" }} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#111827] leading-snug">{n.title}</p>
              <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "#6b7280" }}>{n.body}</p>
              <p className="text-[10px] mt-1.5" style={{ color: "#d1d5db" }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Hotel card — modern layout ── */
function HotelCard({ hotel, isCheckoutDay, nextHotelName }: { hotel: Hotel; isCheckoutDay: boolean; nextHotelName?: string }) {
  const nights = nightsBetween(hotel.check_in, hotel.check_out);
  const mealFull: Record<string, string> = { "B&D": "Breakfast & Dinner", "CP": "Breakfast only", "MAP": "Breakfast & Dinner", "AP": "All meals" };

  return (
    <div className="mx-4 rounded-2xl overflow-hidden mb-4" style={{ background: "#fff" }}>
      {/* Photo with full overlay */}
      <div className="w-full relative" style={{ height: 170, background: "#1a2744" }}>
        {hotel.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 50%)" }} />
        <span className="absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>
          {isCheckoutDay ? "Last night here" : "Tonight's stay"}
        </span>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-[19px] leading-snug">{hotel.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={9} style={{ color: "rgba(255,255,255,0.5)" }} />
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{hotel.location}</p>
            </div>
          </div>
          <a href={`tel:${hotel.phone}`} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 tap-active" style={{ background: "#16a34a" }}>
            <Phone size={14} className="text-white" />
          </a>
        </div>
      </div>

      {/* Info section */}
      <div className="px-4 pt-4 pb-4">
        {/* Date flow: check-in → Nights → check-out */}
        <div className="flex items-center gap-2 mb-3">
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#9ca3af" }}>Check-in</p>
            <p className="text-[16px] font-black text-[#111827]">{fmtShort(hotel.check_in)}</p>
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-2">
            <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: "#1a2744", color: "#fff" }}>
              {nights}N
            </span>
            <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#9ca3af" }}>Check-out</p>
            <p className="text-[16px] font-black text-[#111827]">{fmtShort(hotel.check_out)}</p>
          </div>
        </div>

        {/* Room & Meals as small pills */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: "#f3f4f6", color: "#374151" }}>
            🛏 {hotel.room_type}
          </span>
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: "#f3f4f6", color: "#374151" }}>
            🍽 {mealFull[hotel.meal_plan] ?? hotel.meal_plan}
          </span>
        </div>

        {/* WiFi */}
        {hotel.wifi_name && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: "#eff6ff" }}>
            <Wifi size={13} style={{ color: "#2563eb", flexShrink: 0 }} />
            <span className="text-[12px] font-semibold" style={{ color: "#2563eb" }}>{hotel.wifi_name}</span>
            {hotel.wifi_password && (
              <span className="text-[12px] font-mono font-black text-[#111827] ml-1">{hotel.wifi_password}</span>
            )}
          </div>
        )}

        {isCheckoutDay && nextHotelName && (
          <p className="text-[11px] mt-3 text-center" style={{ color: "#9ca3af" }}>Moving to {nextHotelName} today</p>
        )}
      </div>
    </div>
  );
}

/* ── Places — 2-column photo grid ── */
function PlacesToVisit({ location }: { location: string }) {
  const places = getPlacesForLocation(location);
  if (places.length === 0) return null;

  const TYPE_BG: Record<string, string> = { nature: "#dcfce7", heritage: "#fef9c3", religious: "#fce7f3", activity: "#dbeafe", market: "#fff7ed", viewpoint: "#f3e8ff" };
  const TYPE_FG: Record<string, string> = { nature: "#15803d", heritage: "#a16207", religious: "#be185d", activity: "#1d4ed8", market: "#c2410c", viewpoint: "#7e22ce" };

  return (
    <div className="mx-4 mb-4">
      <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>
        Explore · {location.split(",")[0]}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {places.map((place, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
            {place.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={place.image} alt={place.name} className="w-full object-cover" style={{ height: 88 }} />
            ) : (
              <div className="w-full flex items-center justify-center text-[28px]" style={{ height: 88, background: "#f7f7f5" }}>
                {place.emoji}
              </div>
            )}
            <div className="px-3 pt-2 pb-3">
              <p className="text-[12px] font-bold text-[#111827] leading-snug">{place.name}</p>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full capitalize mt-1 inline-block"
                style={{ background: TYPE_BG[place.type] ?? "#f3f4f6", color: TYPE_FG[place.type] ?? "#374151" }}>
                {place.type}
              </span>
              {place.tip && (
                <p className="text-[10px] mt-1 leading-snug" style={{ color: "#9ca3af" }}>{place.tip}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── In-trip ── */
function InTripScreen({ trip, phase }: { trip: Trip; phase: Extract<TripPhase, { type: "in-trip" }> }) {
  const t = today();
  const hotel = trip.hotels.find(h => h.check_in <= t && t < h.check_out);
  const nextHotel = trip.hotels.find(h => h.check_in > t);
  const isCheckoutDay = hotel?.check_out === t;
  const activityPass = trip.passes.find(p => p.date === t && p.type === "activity");
  const location = hotel?.location ?? trip.destination.split(" · ")[0];
  const weather = useWeather(location);
  const todayItinerary = trip.itinerary.find(d => d.date === t);

  const mealLabel: Record<string, string> = { "B&D": "Breakfast & Dinner", "CP": "Breakfast", "MAP": "Breakfast & Dinner", "AP": "All meals" };
  const includedItems: string[] = [];
  if (hotel) {
    includedItems.push(`Stay at ${hotel.name}`);
    if (hotel.meal_plan) includedItems.push(mealLabel[hotel.meal_plan] ?? `${hotel.meal_plan} meals`);
  }
  if (activityPass) includedItems.push(`${activityPass.title} tickets`);
  if (todayItinerary?.included) includedItems.push(...todayItinerary.included);
  const arrivingToday = trip.hotels.find(h => h.check_in === t);
  if (arrivingToday || (hotel && isCheckoutDay)) includedItems.push("AC Tempo Traveller transfer");

  const tomorrow = trip.itinerary.find(d => d.day === phase.day + 1);
  const tmrHotel = trip.hotels.find(h => tomorrow && h.check_in === tomorrow.date);

  return (
    <>
      {/* 1. Day header — solid color, no image */}
      <div className="mx-4 rounded-2xl mb-4 px-5 pt-5 pb-5" style={{ background: "linear-gradient(135deg, #1a2744 0%, #22336b 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full"
            style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80" }}>
            Day {phase.day} of {phase.total}
          </span>
          {weather ? (
            <div className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} width={18} height={18} alt="" />
              <span className="text-white text-[12px] font-bold">{weather.temp}°C</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <span className="text-[12px]">🌤️</span>
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{location.split(",")[0]}</span>
            </div>
          )}
        </div>
        <h2 className="text-[22px] font-black text-white leading-snug mb-2">{phase.title}</h2>
        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{phase.description}</p>
        <p className="text-[11px] mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>{fmt(t)}</p>
      </div>

      {/* 2. Operator updates */}
      <DayUpdatesFeed date={t} organizer={trip.organizer} />

      {/* 3. Checkout alert */}
      {isCheckoutDay && hotel && (
        <div className="mx-4 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3"
          style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
          <AlertTriangle size={20} style={{ color: "#f97316", flexShrink: 0 }} />
          <div>
            <p className="text-[13px] font-bold" style={{ color: "#c2410c" }}>Checkout today by 11:00 AM</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>Moving to {nextHotel?.name ?? "next hotel"}</p>
          </div>
        </div>
      )}

      {/* 4. Activity pass */}
      {activityPass && (
        <div className="mx-4 rounded-2xl px-5 py-4 mb-4"
          style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎟️</span>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>Today&apos;s activity</p>
              <p className="text-[16px] font-black text-[#111827]">{activityPass.title}</p>
              {activityPass.slot && <p className="text-[12px] font-bold mt-0.5 text-[#111827]">🕐 {activityPass.slot}</p>}
            </div>
          </div>
        </div>
      )}

      {/* 5. Included today */}
      {includedItems.length > 0 && (
        <div className="mx-4 mb-4 rounded-2xl px-5 py-5" style={{ background: "#fff" }}>
          <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Included today</p>
          {includedItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: i < includedItems.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
              <CheckCircle2 size={15} style={{ color: "#16a34a", flexShrink: 0 }} />
              <p className="text-[13px]" style={{ color: "#374151" }}>{item}</p>
            </div>
          ))}
        </div>
      )}

      {/* 6. Hotel pill grid */}
      {hotel && <HotelCard hotel={hotel} isCheckoutDay={isCheckoutDay} nextHotelName={nextHotel?.name} />}

      {/* 7. Driver */}
      <DriverCard trip={trip} />

      {/* 8. Places 2-col grid */}
      <PlacesToVisit location={location} />

      {/* 9. Tomorrow */}
      {!phase.isLastDay && tomorrow && (
        <div className="mx-4 rounded-2xl overflow-hidden mb-4" style={{ background: "#fff" }}>
          {tomorrow.coverImage && (
            <div className="relative" style={{ height: 80 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tomorrow.coverImage} alt={tomorrow.title} className="w-full h-full object-cover" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, transparent 65%)" }} />
              <p className="absolute left-4 text-[9px] font-bold tracking-widest uppercase text-white" style={{ top: "50%", transform: "translateY(-50%)" }}>
                Tomorrow · Day {phase.day + 1}
              </p>
            </div>
          )}
          <div className="px-5 py-4">
            {!tomorrow.coverImage && (
              <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9ca3af" }}>Tomorrow · Day {phase.day + 1}</p>
            )}
            <p className="text-[15px] font-bold text-[#111827]">{tomorrow.title}</p>
            <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "#6b7280" }}>{tomorrow.description}</p>
            {tmrHotel && (
              <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <span className="text-base">🏨</span>
                <p className="text-[12px]" style={{ color: "#9ca3af" }}>Checking into {tmrHotel.name}, {tmrHotel.location}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Pre-trip ── */
function PreTripScreen({ trip, phase }: { trip: Trip; phase: Extract<TripPhase, { type: "pre-trip" }> }) {
  const onward = trip.passes.find(p => p.type === "flight" && p.subtype === "onward");
  const checklist = [
    { label: "Valid ID — Aadhaar or Passport", done: true },
    { label: "Flight tickets saved in app", done: true },
    { label: "Hotel list saved offline", done: true },
    { label: "Emergency contacts saved", done: false },
    { label: "Travel insurance", done: false },
    { label: "Cash + UPI ready", done: true },
  ];
  return (
    <>
      <div className="mx-4 rounded-2xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #1a2744 0%, #1e3a6e 100%)" }}>
        <div className="px-6 pt-7 pb-6">
          <p className="text-[11px] font-bold tracking-[2px] uppercase mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Your trip starts in</p>
          <p className="text-[72px] font-black text-white leading-none">{phase.daysUntil}</p>
          <p className="text-[20px] font-bold text-white mt-1">days to go ✈️</p>
          <p className="text-[12px] mt-3" style={{ color: "rgba(255,255,255,0.45)" }}>{fmt(trip.start_date)}</p>
        </div>
        {onward && (
          <div className="mx-4 mb-5 rounded-2xl px-5 py-4" style={{ background: "rgba(255,255,255,0.08)" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>First flight · {onward.reference}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[26px] font-black text-white">{(onward.from ?? "").split(" ")[0]}</p>
                <p className="text-[13px] font-bold text-white">{onward.departure}</p>
              </div>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>✈ via {onward.via}</p>
              <div className="text-right">
                <p className="text-[26px] font-black text-white">{(onward.to ?? "").split(" ")[0]}</p>
                <p className="text-[13px] font-bold text-white">{onward.arrival}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-4 mb-4 rounded-2xl px-5 py-5" style={{ background: "#fff" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Trip overview</p>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Days", value: trip.itinerary.length }, { label: "Travellers", value: trip.group_size }, { label: "Hotels", value: trip.hotels.length }].map((s, i) => (
            <div key={i} className="rounded-2xl px-3 py-4 text-center" style={{ background: "#f7f7f5" }}>
              <p className="text-[30px] font-black text-[#111827] leading-none">{s.value}</p>
              <p className="text-[10px] font-bold mt-1" style={{ color: "#9ca3af" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 rounded-2xl px-5 py-4 mb-4" style={{ background: "#fff" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Day 1 · On arrival at {(onward?.to ?? "").split(" ")[0]}</p>
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

      <div className="mx-4 rounded-2xl px-5 py-4 mb-4" style={{ background: "#fff" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Pre-trip checklist</p>
        {checklist.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < checklist.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <CheckCircle2 size={18} style={{ color: item.done ? "#16a34a" : "#d1d5db", flexShrink: 0 }} />
            <p className="text-[13px]" style={{ color: item.done ? "#111827" : "#9ca3af" }}>{item.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Departure day ── */
function DepartureDayScreen({ trip }: { trip: Trip }) {
  const onward = trip.passes.find(p => p.type === "flight" && p.subtype === "onward");
  return (
    <>
      <div className="mx-4 rounded-2xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" }}>
        <div className="px-6 pt-7 pb-7">
          <p className="text-[11px] font-bold tracking-[2px] uppercase mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Today is the day!</p>
          <p className="text-[32px] font-black text-white leading-tight">Your Kashmir<br />adventure begins 🏔️</p>
          <p className="text-[13px] mt-3" style={{ color: "rgba(255,255,255,0.65)" }}>{fmt(trip.start_date)}</p>
        </div>
      </div>
      {onward && (
        <div className="mx-4 rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-5" style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>Your flight today</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[40px] font-black text-white leading-none">{onward.departure}</p>
                <p className="text-[15px] font-bold text-white mt-1">{(onward.from ?? "").split(" ")[0]}</p>
              </div>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>✈ via {onward.via}</p>
              <div className="text-right">
                <p className="text-[40px] font-black text-white leading-none">{onward.arrival}</p>
                <p className="text-[15px] font-bold text-white mt-1">{(onward.to ?? "").split(" ")[0]}</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#fff" }}>
            <p className="text-[13px] font-bold text-[#111827]">PNR: {onward.reference}</p>
            <p className="text-[12px]" style={{ color: "#9ca3af" }}>Be at airport 2hrs early</p>
          </div>
        </div>
      )}
      <div className="mx-4 rounded-2xl px-5 py-4 mb-4" style={{ background: "#fff" }}>
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

/* ── Return day ── */
function ReturnDayScreen({ trip }: { trip: Trip }) {
  const returnFlight = trip.passes.find(p => p.type === "flight" && p.subtype === "return");
  return (
    <>
      <div className="mx-4 rounded-2xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
        <div className="px-6 pt-7 pb-7">
          <p className="text-[11px] font-bold tracking-[2px] uppercase mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>Last day · Time to head home</p>
          <p className="text-[28px] font-black text-white leading-tight">Safe travels! 🙏<br />See you again.</p>
        </div>
      </div>
      {returnFlight && (
        <div className="mx-4 rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-5" style={{ background: "linear-gradient(135deg, #312e81, #4f46e5)" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>Your return flight</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[40px] font-black text-white leading-none">{returnFlight.departure}</p>
                <p className="text-[15px] font-bold text-white mt-1">{(returnFlight.from ?? "").split(" ")[0]}</p>
              </div>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>✈ via {returnFlight.via}</p>
              <div className="text-right">
                <p className="text-[40px] font-black text-white leading-none">{returnFlight.arrival}</p>
                <p className="text-[15px] font-bold text-white mt-1">{(returnFlight.to ?? "").split(" ")[0]}</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#fff" }}>
            <p className="text-[13px] font-bold text-[#111827]">PNR: {returnFlight.reference}</p>
            <p className="text-[12px]" style={{ color: "#9ca3af" }}>Be at airport 2hrs early</p>
          </div>
        </div>
      )}
      <div className="mx-4 rounded-2xl px-5 py-4 mb-4" style={{ background: "#fff" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Before you leave</p>
        {["🛄 Check out of hotel by 11:00 AM", "🪪 Keep ID and boarding pass ready", "🧳 Check you have all your belongings", "🤝 Driver will drop you to airport"].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <span className="text-xl shrink-0">{item.slice(0, 2)}</span>
            <p className="text-[13px] text-[#111827]">{item.slice(3)}</p>
          </div>
        ))}
      </div>
      <DriverCard trip={trip} />
      <div className="mx-4 rounded-2xl px-5 py-5 mb-4 text-center" style={{ background: "#fff" }}>
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
      <div className="mx-4 rounded-2xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #92400e 0%, #f97316 100%)" }}>
        <div className="px-6 pt-7 pb-7">
          <p className="text-[40px] mb-2">🏔️</p>
          <p className="text-[28px] font-black text-white leading-tight">What a trip!</p>
          <p className="text-[13px] mt-2" style={{ color: "rgba(255,255,255,0.6)" }}>{trip.name} · {trip.itinerary.length} days · {trip.group_size} travellers</p>
        </div>
      </div>
      <div className="mx-4 rounded-2xl px-5 py-5 mb-4 text-center" style={{ background: "#fff" }}>
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
export default function NowScreen({ trip }: { trip: Trip; onTabChange?: (tab: import("../ui/BottomNav").Tab) => void }) {
  const [overrideDate, setOverrideDate] = useState<string | null>(null);
  _dateOverride = overrideDate;

  const phase = getTripPhase(trip);
  const op = trip.operator;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetingEmoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";

  const phaseContext =
    phase.type === "pre-trip" ? `Trip starts in ${phase.daysUntil} days` :
    phase.type === "departure-day" ? "Departure day — have a great journey!" :
    phase.type === "in-trip" ? `Day ${phase.day} of ${phase.total} · You're on your trip` :
    phase.type === "return-day" ? "Heading home today — safe travels!" :
    "Trip complete — hope it was wonderful!";

  return (
    <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5", paddingBottom: 16 }}>

      {/* Header */}
      <div className="px-4 pt-5 pb-2">
        {/* Operator row */}
        {op && (
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {op.logo && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] shrink-0" style={{ background: "#efefef" }}>
                  {op.logo}
                </div>
              )}
              <p className="text-[11px] font-bold" style={{ color: op.color }}>{op.name}</p>
            </div>
            {op.phone && (
              <a href={`tel:${op.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl tap-active" style={{ background: "#ebebeb" }}>
                <PhoneCall size={12} style={{ color: op.color }} />
                <span className="text-[10px] font-semibold" style={{ color: "#374151" }}>Contact</span>
              </a>
            )}
          </div>
        )}

        {/* Greeting */}
        <p className="text-[13px] font-medium mb-1" style={{ color: "#9ca3af" }}>{greeting} {greetingEmoji}</p>
        <h1 className="text-[28px] font-black leading-tight" style={{ color: "#111827" }}>{trip.name}</h1>
        <p className="text-[12px] mt-1 flex items-center gap-1" style={{ color: "#9ca3af" }}>
          <MapPin size={10} />{trip.destination}
        </p>

        {/* Phase context pill */}
        <div className="mt-3 inline-flex items-center px-3 py-1.5 rounded-full" style={{ background: "#1a2744" }}>
          <p className="text-[11px] font-semibold text-white">{phaseContext}</p>
        </div>
      </div>

      {/* Day strip navigator */}
      <div className="mt-4">
        <DayStrip trip={trip} overrideDate={overrideDate} onChange={setOverrideDate} />
      </div>

      <div className="h-4" />

      {phase.type === "pre-trip" && <PreTripScreen trip={trip} phase={phase} />}
      {phase.type === "departure-day" && <DepartureDayScreen trip={trip} />}
      {phase.type === "in-trip" && <InTripScreen trip={trip} phase={phase} />}
      {phase.type === "return-day" && <ReturnDayScreen trip={trip} />}
      {phase.type === "post-trip" && <PostTripScreen trip={trip} />}

      <div className="h-4" />
    </div>
  );
}
