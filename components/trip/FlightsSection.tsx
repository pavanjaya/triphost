"use client";

import { Plane } from "lucide-react";
import { Flight } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function FlightCard({ flight }: { flight: Flight }) {
  const fromCode = flight.from.split(" ")[0];
  const toCode = flight.to.split(" ")[0];
  const fromCity = flight.from.slice(fromCode.length + 1);
  const toCity = flight.to.slice(toCode.length + 1);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${flight.type === "onward" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
          {flight.type === "onward" ? "✈ Onward" : "✈ Return"}
        </span>
        <div className="text-right">
          <p className="text-xs text-gray-400">PNR</p>
          <p className="font-bold text-gray-900 text-sm tracking-wider">{flight.pnr}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-center flex-1">
          <p className="text-xl font-bold text-gray-900">{flight.departure}</p>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">{fromCode}</p>
          <p className="text-xs text-gray-400 leading-tight">{fromCity}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center w-full">
            <div className="h-px flex-1 bg-gray-200" />
            <Plane size={14} className="text-gray-400 mx-1" />
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <p className="text-xs text-gray-400">via {flight.via}</p>
          <p className="text-xs text-gray-400">{flight.number}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xl font-bold text-gray-900">{flight.arrival}</p>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">{toCode}</p>
          <p className="text-xs text-gray-400 leading-tight">{toCity}</p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">{formatDate(flight.date)}</p>
    </div>
  );
}

export default function FlightsSection({ flights }: { flights: Flight[] }) {
  return (
    <section className="mx-4">
      <div className="flex items-center gap-2 mb-2">
        <Plane size={14} className="text-gray-400" />
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Flights</h2>
      </div>
      <div className="flex flex-col gap-3">
        {flights.map((f, i) => <FlightCard key={i} flight={f} />)}
      </div>
    </section>
  );
}
