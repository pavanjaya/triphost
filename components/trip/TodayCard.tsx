"use client";

import { Sunrise } from "lucide-react";
import { ItineraryDay } from "@/lib/types";

function getToday(itinerary: ItineraryDay[]): ItineraryDay | null {
  const today = new Date().toISOString().split("T")[0];
  return itinerary.find((d) => d.date === today) ?? null;
}

export default function TodayCard({ itinerary }: { itinerary: ItineraryDay[] }) {
  const today = getToday(itinerary);
  if (!today) return null;

  return (
    <div className="mx-4 -mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sunrise size={16} className="text-amber-500" />
        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Today — Day {today.day}</span>
      </div>
      <p className="font-semibold text-gray-800 text-sm">{today.title}</p>
      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{today.description}</p>
    </div>
  );
}
