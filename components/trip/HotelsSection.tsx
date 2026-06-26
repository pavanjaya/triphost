"use client";

import { Hotel as HotelIcon, Phone, MapPin, Utensils } from "lucide-react";
import { Hotel } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function HotelsSection({ hotels }: { hotels: Hotel[] }) {
  return (
    <section className="mx-4">
      <div className="flex items-center gap-2 mb-2">
        <HotelIcon size={14} className="text-gray-400" />
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Hotels</h2>
      </div>
      <div className="flex flex-col gap-3">
        {hotels.map((hotel, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm leading-tight">{hotel.name}</p>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                  <MapPin size={11} />
                  <span>{hotel.location}</span>
                </div>
                <div className="flex gap-3 mt-2">
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">Check-in </span>
                    <span className="font-medium text-gray-700">{formatDate(hotel.check_in)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">Out </span>
                    <span className="font-medium text-gray-700">{formatDate(hotel.check_out)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{hotel.room_type}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Utensils size={10} />
                    {hotel.meal_plan}
                  </span>
                </div>
              </div>
              <a
                href={`tel:${hotel.phone}`}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors shrink-0"
              >
                <Phone size={12} />
                Call
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
