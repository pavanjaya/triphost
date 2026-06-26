"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ItineraryDay } from "@/lib/types";

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

function DayCard({ day, total }: { day: ItineraryDay; total: number }) {
  const [open, setOpen] = useState(isToday(day.date));
  const today = isToday(day.date);
  const past = isPast(day.date);
  const color = dayColors[(day.day - 1) % dayColors.length];

  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center" style={{ width: 36 }}>
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-black text-[13px] text-white shrink-0"
          style={{ background: today ? "#2563eb" : past ? "#d1d5db" : color }}>
          {day.day}
        </div>
        {day.day < total && (
          <div className="flex-1 w-0.5 mt-1" style={{ background: past ? "#e5e7eb" : "#e5e7eb", minHeight: 16 }} />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 mb-3">
        <button
          className="w-full rounded-3xl overflow-hidden text-left tap-active"
          style={{
            background: today ? "linear-gradient(135deg, #eff6ff, #dbeafe)" : "#fff",
            boxShadow: today ? "0 4px 20px rgba(37,99,235,0.12)" : "0 1px 6px rgba(0,0,0,0.06)",
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
            <div className="px-4 pb-4">
              <div className="h-px mb-3" style={{ background: "rgba(0,0,0,0.06)" }} />
              <p className="text-[13px] leading-relaxed" style={{ color: "#4b5563" }}>{day.description}</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default function PlanScreen({ itinerary }: { itinerary: ItineraryDay[] }) {
  return (
    <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
      <div className="px-5 pt-12 pb-5">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>{itinerary.length} days</p>
        <h2 className="text-[26px] font-bold text-[#111827]">Itinerary</h2>
      </div>
      <div className="px-4 pb-8">
        {itinerary.map((day) => <DayCard key={day.day} day={day} total={itinerary.length} />)}
      </div>
    </div>
  );
}
