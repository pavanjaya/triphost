"use client";

import { Car, Phone } from "lucide-react";
import { Driver } from "@/lib/types";

export default function DriverCard({ driver }: { driver: Driver }) {
  return (
    <section className="mx-4">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Your Driver</h2>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a2744] flex items-center justify-center text-white font-bold text-sm">
              {driver.name.split(" ").pop()?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{driver.name}</p>
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                <Car size={11} />
                <span>{driver.vehicle_type} · {driver.vehicle_number}</span>
              </div>
            </div>
          </div>
          <a
            href={`tel:${driver.phone}`}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
          >
            <Phone size={13} />
            Call
          </a>
        </div>
      </div>
    </section>
  );
}
