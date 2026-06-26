"use client";

import { Phone } from "lucide-react";
import { Trip } from "@/lib/types";

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function TripHeader({ trip }: { trip: Trip }) {
  const op = trip.operator;
  const brandColor = op?.color ?? "#1a2744";
  const rgb = hexToRgb(brandColor);

  return (
    <div>
      {/* Operator branding band */}
      {op && (
        <div
          className="px-5 pt-4 pb-3 flex items-center justify-between"
          style={{ background: `rgba(${rgb}, 0.08)`, borderBottom: `1px solid rgba(${rgb}, 0.12)` }}
        >
          <div className="flex items-center gap-2.5">
            {op.logo && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] shrink-0"
                style={{ background: `rgba(${rgb}, 0.12)` }}
              >
                {op.logo}
              </div>
            )}
            <div>
              <p className="text-[13px] font-bold leading-tight" style={{ color: brandColor }}>
                {op.name}
              </p>
              {op.tagline && (
                <p className="text-[10px] leading-tight mt-0.5" style={{ color: `rgba(${rgb}, 0.65)` }}>
                  {op.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Contact operator */}
          {op.phone && (
            <a
              href={`tel:${op.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl tap-active"
              style={{ background: brandColor }}
            >
              <Phone size={12} color="white" />
              <span className="text-[11px] font-bold text-white">Call</span>
            </a>
          )}
        </div>
      )}

      {/* Trip identity */}
      <div className="px-5 pt-5 pb-4" style={{ background: "#1a2744" }}>
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          {trip.destination}
        </p>
        <h1 className="text-[26px] font-black text-white leading-tight mb-4">{trip.name}</h1>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-2xl px-3 py-2"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <span className="text-[11px] font-semibold text-white">
              {formatDateShort(trip.start_date)} – {formatDateShort(trip.end_date)}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-2xl px-3 py-2"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <span className="text-[11px] font-semibold text-white">{trip.group_size} travellers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
