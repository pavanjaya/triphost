"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Utensils, Ticket, Check } from "lucide-react";
import { Trip, ItineraryDay } from "@/lib/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}
function isToday(d: string) { return d === new Date().toISOString().split("T")[0]; }
function isPast(d: string) { return d < new Date().toISOString().split("T")[0]; }

const dayEmojis = ["🛫", "🏔️", "🚡", "🛶", "🍎", "🌸", "🚗", "🙏", "🛬"];
const dayColors = [
  "#1a2744", "#1e3a6e", "#0369a1", "#0891b2",
  "#16a34a", "#ca8a04", "#9333ea", "#dc2626", "#1a2744",
];

const DAY_TIPS: Record<number, string> = {
  1: "Dress modestly at Dargah Hazratbal — it's an active mosque.",
  2: "Carry warm layers for Zero Point, temperature drops sharply.",
  3: "Gondola Phase 2 goes to 4,200m — take it slow if you feel dizzy.",
  4: "Haggle gently in the houseboats for handicrafts and saffron.",
  5: "Local jeeps to Baisaran are ₹800–1,000 per jeep — share with group.",
  6: "Betab Valley is stunning in the morning — start early.",
  7: "Road to Katra is winding — keep motion sickness tablets handy.",
  8: "Start the Vaishno Devi trek by 4 AM to beat the crowd.",
  9: "Keep boarding pass and ID handy — Jammu airport security is thorough.",
};

function DayCard({ day, trip }: { day: ItineraryDay; trip: Trip }) {
  const [open, setOpen] = useState(isToday(day.date));
  const today = isToday(day.date);
  const past = isPast(day.date);
  const color = dayColors[(day.day - 1) % dayColors.length];
  const total = trip.itinerary.length;

  // Hotel tonight
  const hotel = trip.hotels.find(h => h.check_in <= day.date && day.date < h.check_out);
  // Passes today (activities / tickets)
  const tickets = trip.passes.filter(p => p.date === day.date && (p.type === "activity" || p.type === "other"));
  // Parse activities from description (split by " · ")
  const parts = day.description.split(" · ");
  const tip = DAY_TIPS[day.day];
  // Is it a travel day (title has →)?
  const isTravel = day.title.includes("→");

  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center" style={{ width: 36 }}>
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-black text-[13px] text-white shrink-0"
          style={{ background: today ? "#2563eb" : past ? "#d1d5db" : color }}>
          {day.day}
        </div>
        {day.day < total && (
          <div className="flex-1 w-0.5 mt-1" style={{ background: "#e5e7eb", minHeight: 16 }} />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 mb-3">
        <button
          className="w-full rounded-3xl overflow-hidden text-left tap-active"
          style={{
            background: today ? "linear-gradient(135deg, #eff6ff, #dbeafe)" : "#fff",
            border: today ? "1.5px solid #bfdbfe" : "1.5px solid #efefef",
          }}
          onClick={() => setOpen(o => !o)}
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <span className="text-2xl shrink-0">{dayEmojis[day.day - 1] ?? "📍"}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-bold text-[#111827] leading-snug">{day.title}</p>
                {today && (
                  <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: "#2563eb" }}>TODAY</span>
                )}
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{formatDate(day.date)}</p>
            </div>
            <div style={{ color: "#d1d5db" }}>
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {open && (
            <div className="px-4 pb-4" onClick={e => e.stopPropagation()}>
              <div className="h-px mb-4" style={{ background: "rgba(0,0,0,0.06)" }} />

              {/* Activity chips */}
              {parts.length > 1 ? (
                <div className="mb-4">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9ca3af" }}>
                    {isTravel ? "Along the way" : "Places & activities"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parts.map((p, i) => (
                      <span key={i} className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: "#f7f7f5", color: "#374151" }}>
                        {p.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#4b5563" }}>{day.description}</p>
              )}

              {/* Booked tickets */}
              {tickets.length > 0 && tickets.map((tk, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-3"
                  style={{ background: "linear-gradient(135deg, #fef9c3, #fef08a)", border: "1px solid #fde047" }}>
                  <Ticket size={15} style={{ color: "#a16207", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold" style={{ color: "#713f12" }}>{tk.title}</p>
                    {tk.slot && <p className="text-[11px] mt-0.5" style={{ color: "#a16207" }}>🕐 {tk.slot}</p>}
                  </div>
                </div>
              ))}

              {/* Tonight's hotel */}
              {hotel && (
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-3"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <span className="text-lg shrink-0">🏨</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold" style={{ color: "#14532d" }}>{hotel.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "#16a34a" }}>
                        <MapPin size={10} />{hotel.location}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "#16a34a" }}>
                        <Utensils size={10} />{hotel.meal_plan} included
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pro tip */}
              {tip && (
                <div className="flex gap-2 rounded-2xl px-4 py-3"
                  style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <span className="text-sm shrink-0">💡</span>
                  <p className="text-[12px] leading-relaxed" style={{ color: "#1e40af" }}>{tip}</p>
                </div>
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Packing Checklist ── */
const PACKING_ITEMS = [
  { category: "Documents", emoji: "📄", items: ["Aadhaar / Passport", "Flight tickets (digital)", "Hotel bookings (digital)", "Travel insurance"] },
  { category: "Clothing", emoji: "👕", items: ["Warm jacket / fleece", "Waterproof outer layer", "Comfortable walking shoes", "Woollen socks (3–4 pairs)", "Thermal inners"] },
  { category: "Toiletries", emoji: "🪥", items: ["Toothbrush & toothpaste", "Sunscreen SPF 50+", "Lip balm", "Personal medicines", "Basic first aid"] },
  { category: "Electronics", emoji: "🔌", items: ["Phone charger", "Power bank", "Universal adapter", "Earphones"] },
  { category: "Essentials", emoji: "🎒", items: ["Cash (₹5,000+ recommended)", "UPI / cards", "Snacks for journey", "Water bottle", "Hand sanitiser"] },
  { category: "Kashmir specific", emoji: "🏔", items: ["Sunglasses (UV protection)", "Cap / balaclava", "Gloves", "Walking stick (for trekking)", "Motion sickness tablets"] },
];

function PackingSection({ trip }: { trip: Trip }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const allItems = PACKING_ITEMS.flatMap(c => c.items.map(i => `${c.category}::${i}`));
  const pct = Math.round((checked.size / allItems.length) * 100);
  const daysLeft = Math.ceil((new Date(trip.start_date).getTime() - new Date().getTime()) / 86400000);

  function toggle(key: string) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });
  }

  return (
    <div className="mx-4 mb-4 rounded-3xl overflow-hidden" style={{ border: "1.5px solid #efefef", background: "#fff" }}>
      <button className="w-full flex items-center gap-3 px-5 py-4 tap-active" onClick={() => setOpen(o => !o)}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0" style={{ background: "#f7f7f5" }}>🎒</div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[14px] font-bold text-[#111827]">Packing Checklist</p>
          <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{checked.size}/{allItems.length} packed · {daysLeft > 0 ? `${daysLeft} days to go` : "Trip starts today"}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: pct === 100 ? "#dcfce7" : "#eff6ff", color: pct === 100 ? "#16a34a" : "#2563eb" }}>{pct}%</span>
          {open ? <ChevronUp size={16} style={{ color: "#d1d5db" }} /> : <ChevronDown size={16} style={{ color: "#d1d5db" }} />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <div className="w-full h-1.5 rounded-full my-4" style={{ background: "#f7f7f5" }}>
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? "#16a34a" : "#2563eb" }} />
          </div>
          {PACKING_ITEMS.map(cat => (
            <div key={cat.category} className="mb-4 last:mb-0">
              <p className="text-[11px] font-bold mb-2" style={{ color: "#9ca3af" }}>{cat.emoji} {cat.category}</p>
              {cat.items.map(item => {
                const key = `${cat.category}::${item}`;
                const done = checked.has(key);
                return (
                  <button key={item} onClick={() => toggle(key)}
                    className="w-full flex items-center gap-3 py-2.5 tap-active text-left"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: done ? "#16a34a" : "#fff", border: done ? "none" : "2px solid #d1d5db" }}>
                      {done && <Check size={11} className="text-white" />}
                    </div>
                    <p className="text-[13px]" style={{ color: done ? "#9ca3af" : "#111827", textDecoration: done ? "line-through" : "none" }}>{item}</p>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlanScreen({ itinerary, trip }: { itinerary: ItineraryDay[]; trip: Trip }) {
  return (
    <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
      <div className="px-5 pt-12 pb-5">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>{itinerary.length} days</p>
        <h2 className="text-[26px] font-bold text-[#111827]">Itinerary</h2>
      </div>
      <PackingSection trip={trip} />
      <div className="px-4 pb-8">
        {itinerary.map((day) => <DayCard key={day.day} day={day} trip={trip} />)}
      </div>
    </div>
  );
}
