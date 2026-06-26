"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { ItineraryDay } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function DayRow({ day, defaultOpen }: { day: ItineraryDay; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#1a2744] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {day.day}
          </span>
          <div>
            <p className="font-medium text-gray-900 text-sm leading-tight">{day.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(day.date)}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <p className="px-4 pb-3 text-sm text-gray-500 leading-relaxed pl-14">{day.description}</p>
      )}
    </div>
  );
}

export default function ItinerarySection({ itinerary }: { itinerary: ItineraryDay[] }) {
  return (
    <section className="mx-4">
      <div className="flex items-center gap-2 mb-2">
        <CalendarDays size={14} className="text-gray-400" />
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Day-by-Day Itinerary</h2>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {itinerary.map((day, i) => (
          <DayRow key={day.day} day={day} defaultOpen={i === 0} />
        ))}
      </div>
    </section>
  );
}
