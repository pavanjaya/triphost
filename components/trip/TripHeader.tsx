"use client";

import { MapPin, Users, Calendar } from "lucide-react";
import { Trip } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TripHeader({ trip }: { trip: Trip }) {
  return (
    <div className="bg-[#1a2744] text-white px-4 pt-10 pb-8">
      <p className="text-xs font-semibold tracking-widest uppercase text-blue-300 mb-1">
        {trip.organizer}
      </p>
      <h1 className="text-2xl font-bold leading-tight mb-1">{trip.name}</h1>
      <div className="flex items-center gap-1 text-blue-200 text-sm mb-4">
        <MapPin size={13} />
        <span>{trip.destination}</span>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-xs font-medium">
          <Calendar size={13} />
          {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-xs font-medium">
          <Users size={13} />
          {trip.group_size} travellers
        </div>
      </div>
    </div>
  );
}
