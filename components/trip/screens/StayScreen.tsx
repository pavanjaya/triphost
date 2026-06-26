"use client";

import { useState } from "react";
import { Phone, MapPin, Wifi, Copy, Check, PhoneCall, ChevronDown, ChevronUp } from "lucide-react";
import { Trip } from "@/lib/types";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <button onClick={copy} className="flex items-center gap-1 tap-active" style={{ color: copied ? "#16a34a" : "#9ca3af" }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span className="text-[11px] font-bold">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function HotelCard({ hotel, isTonight }: { hotel: Trip["hotels"][0]; isTonight: boolean }) {
  const [open, setOpen] = useState(isTonight);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(hotel.name + " " + hotel.location)}`;

  return (
    <div className="rounded-3xl overflow-hidden mb-3" style={{ border: isTonight ? "1.5px solid #bfdbfe" : "1.5px solid #efefef", background: "#fff" }}>
      <button className="w-full flex items-center gap-3 px-5 py-4 text-left tap-active" onClick={() => setOpen(o => !o)}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-lg"
          style={{ background: isTonight ? "#eff6ff" : "#f7f7f5" }}>🏨</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-bold text-[#111827] truncate">{hotel.name}</p>
            {isTonight && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "#2563eb", color: "#fff" }}>TONIGHT</span>}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "#9ca3af" }}>
              <MapPin size={10} />{hotel.location}
            </span>
            <span className="text-[11px]" style={{ color: "#9ca3af" }}>
              {fmt(hotel.check_in)} → {fmt(hotel.check_out)}
            </span>
          </div>
        </div>
        {open ? <ChevronUp size={16} style={{ color: "#d1d5db", flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: "#d1d5db", flexShrink: 0 }} />}
      </button>

      {open && (
        <div className="px-5 pb-5" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          {/* Stats row */}
          <div className="flex gap-3 mt-4 mb-4">
            <div className="flex-1 rounded-2xl px-3 py-2.5 text-center" style={{ background: "#f7f7f5" }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#9ca3af" }}>Check-in</p>
              <p className="text-[13px] font-bold text-[#111827]">{fmt(hotel.check_in)}</p>
            </div>
            <div className="flex-1 rounded-2xl px-3 py-2.5 text-center" style={{ background: "#f7f7f5" }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#9ca3af" }}>Check-out</p>
              <p className="text-[13px] font-bold text-[#111827]">{fmt(hotel.check_out)}</p>
            </div>
            <div className="flex-1 rounded-2xl px-3 py-2.5 text-center" style={{ background: "#f7f7f5" }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#9ca3af" }}>Meals</p>
              <p className="text-[13px] font-bold text-[#111827]">{hotel.meal_plan}</p>
            </div>
          </div>

          {/* Address */}
          {hotel.address && (
            <div className="flex items-start gap-2 py-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
              <MapPin size={14} style={{ color: "#9ca3af", marginTop: 1, flexShrink: 0 }} />
              <p className="text-[12px] flex-1 leading-relaxed" style={{ color: "#6b7280" }}>{hotel.address}</p>
            </div>
          )}

          {/* WiFi */}
          {hotel.wifi_password && (
            <div className="flex items-center gap-2 py-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
              <Wifi size={14} style={{ color: "#9ca3af", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold" style={{ color: "#9ca3af" }}>{hotel.wifi_name}</p>
                <p className="text-[14px] font-bold font-mono text-[#111827]">{hotel.wifi_password}</p>
              </div>
              <CopyButton text={hotel.wifi_password} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <a href={`tel:${hotel.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold text-white tap-active"
              style={{ background: "#16a34a" }}>
              <Phone size={14} /> Call Hotel
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold tap-active"
              style={{ background: "#f7f7f5", color: "#2563eb" }}>
              <MapPin size={14} /> Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StayScreen({ trip }: { trip: Trip }) {
  const today = new Date().toISOString().split("T")[0];
  const tonightHotel = trip.hotels.find(h => h.check_in <= today && today < h.check_out);

  return (
    <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
      <div className="px-5 pt-12 pb-5">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>{trip.hotels.length} hotels · {trip.itinerary.length} nights</p>
        <h2 className="text-[26px] font-bold text-[#111827]">Your Stay</h2>
      </div>

      {/* Hotels */}
      <div className="px-4 mb-2">
        {trip.hotels.map((h, i) => (
          <HotelCard key={i} hotel={h} isTonight={h === tonightHotel} />
        ))}
      </div>

      {/* Emergency Contacts */}
      <div className="px-4 mb-8">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3 px-1" style={{ color: "#9ca3af" }}>Emergency contacts</p>
        <div className="rounded-3xl overflow-hidden" style={{ border: "1.5px solid #efefef", background: "#fff" }}>
          {trip.contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-5 py-4"
              style={{ borderBottom: i < trip.contacts.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
              <div>
                <p className="text-[13px] font-bold text-[#111827]">{c.name}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{c.role}</p>
              </div>
              <a href={`tel:${c.phone}`}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-full tap-active shrink-0"
                style={{ background: "#fff1f2", color: "#e11d48", border: "1px solid #fecdd3" }}>
                <PhoneCall size={12} />{c.phone.replace("+91", "+91 ")}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
