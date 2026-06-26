"use client";

import { useState } from "react";
import { Phone, MapPin, Utensils, Plane, ChevronDown, ChevronUp, PhoneCall } from "lucide-react";
import { Trip } from "@/lib/types";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

type Section = "hotels" | "flights" | "contacts";

function Accordion({ title, emoji, id, active, onToggle, count, children }: {
  title: string; emoji: string; id: Section; active: Section | null; onToggle: (id: Section) => void; count: number; children: React.ReactNode;
}) {
  const open = active === id;
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <button className="w-full flex items-center justify-between px-5 py-4 tap-active" onClick={() => onToggle(id)}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{emoji}</span>
          <span className="text-[15px] font-bold text-[#111827]">{title}</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{count}</span>
        </div>
        {open ? <ChevronUp size={17} style={{ color: "#9ca3af" }} /> : <ChevronDown size={17} style={{ color: "#9ca3af" }} />}
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <div className="pt-1" />
          {children}
        </div>
      )}
    </div>
  );
}

function HotelCard({ hotel }: { hotel: Trip["hotels"][0] }) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(hotel.name + " " + hotel.location)}`;
  return (
    <div className="rounded-2xl p-4" style={{ background: "#f7f7f5" }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#111827]">{hotel.name}</p>
          <div className="flex items-center gap-1 mt-1" style={{ color: "#9ca3af" }}>
            <MapPin size={11} /><span className="text-[11px]">{hotel.location}</span>
          </div>
          <div className="flex gap-3 mt-2">
            <p className="text-[11px]"><span style={{ color: "#9ca3af" }}>In </span><strong>{fmt(hotel.check_in)}</strong></p>
            <p className="text-[11px]"><span style={{ color: "#9ca3af" }}>Out </span><strong>{fmt(hotel.check_out)}</strong></p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{hotel.room_type}</span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "#9ca3af" }}><Utensils size={10} />{hotel.meal_plan}</span>
          </div>
        </div>
        <a href={`tel:${hotel.phone}`} className="flex items-center gap-1.5 text-white text-[12px] font-bold px-4 py-2 rounded-full tap-active shrink-0" style={{ background: "#16a34a" }}>
          <Phone size={12} /> Call
        </a>
      </div>
      <a href={mapsUrl} target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-bold tap-active"
        style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#2563eb" }}>
        <MapPin size={13} /> Open in Google Maps
      </a>
    </div>
  );
}

function FlightCard({ flight }: { flight: Trip["flights"][0] }) {
  const fromCode = flight.from.split(" ")[0];
  const toCode = flight.to.split(" ")[0];
  const fromCity = flight.from.slice(fromCode.length + 1);
  const toCity = flight.to.slice(toCode.length + 1);
  return (
    <div className="rounded-2xl p-4" style={{ background: "#f7f7f5" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold px-3 py-1 rounded-full"
          style={flight.type === "onward" ? { background: "#eff6ff", color: "#2563eb" } : { background: "#f5f3ff", color: "#7c3aed" }}>
          {flight.type === "onward" ? "✈ Onward" : "✈ Return"}
        </span>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wide" style={{ color: "#9ca3af" }}>PNR</p>
          <p className="text-[16px] font-bold text-[#111827] tracking-wider">{flight.pnr}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-center flex-1">
          <p className="text-[22px] font-bold text-[#111827]">{flight.departure}</p>
          <p className="text-[12px] font-bold" style={{ color: "#4b5563" }}>{fromCode}</p>
          <p className="text-[10px]" style={{ color: "#9ca3af" }}>{fromCity}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center w-full">
            <div className="h-px flex-1" style={{ background: "#e5e7eb" }} />
            <Plane size={13} style={{ color: "#9ca3af", margin: "0 6px" }} />
            <div className="h-px flex-1" style={{ background: "#e5e7eb" }} />
          </div>
          <p className="text-[10px]" style={{ color: "#9ca3af" }}>via {flight.via}</p>
          <p className="text-[9px]" style={{ color: "#d1d5db" }}>{flight.number}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-[22px] font-bold text-[#111827]">{flight.arrival}</p>
          <p className="text-[12px] font-bold" style={{ color: "#4b5563" }}>{toCode}</p>
          <p className="text-[10px]" style={{ color: "#9ca3af" }}>{toCity}</p>
        </div>
      </div>
      <p className="text-center text-[11px] mt-3 pt-3" style={{ color: "#9ca3af", borderTop: "1px solid rgba(0,0,0,0.06)" }}>{fmt(flight.date)}</p>
    </div>
  );
}

export default function InfoScreen({ trip }: { trip: Trip }) {
  const [active, setActive] = useState<Section | null>("hotels");
  const toggle = (id: Section) => setActive((p) => (p === id ? null : id));

  return (
    <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
      <div className="px-5 pt-12 pb-5">
        <p className="text-[12px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>Hotels · Flights · Contacts</p>
        <h2 className="text-[26px] font-bold text-[#111827]">Trip Info</h2>
      </div>
      <div className="px-4 pb-8 flex flex-col gap-3">
        <Accordion title="Hotels" emoji="🏨" id="hotels" active={active} onToggle={toggle} count={trip.hotels.length}>
          {trip.hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}
        </Accordion>
        <Accordion title="Flights" emoji="✈️" id="flights" active={active} onToggle={toggle} count={trip.flights.length}>
          {trip.flights.map((f, i) => <FlightCard key={i} flight={f} />)}
        </Accordion>
        <Accordion title="Emergency Contacts" emoji="🆘" id="contacts" active={active} onToggle={toggle} count={trip.contacts.length}>
          {trip.contacts.map((c, i) => (
            <div key={i} className="rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3" style={{ background: "#f7f7f5" }}>
              <div>
                <p className="text-[13px] font-bold text-[#111827]">{c.name}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{c.role}</p>
              </div>
              <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-full tap-active shrink-0"
                style={{ background: "#fff1f2", color: "#e11d48", border: "1px solid #fecdd3" }}>
                <PhoneCall size={12} />{c.phone.replace("+91", "+91 ")}
              </a>
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
