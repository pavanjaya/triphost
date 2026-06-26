"use client";

import { useState } from "react";
import { Clock, User, Plane, X, Maximize2, Luggage, ArrowRight, FileText } from "lucide-react";
import { Ticket as TicketType, Flight } from "@/lib/types";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function fmtShort(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtLayover(mins: number) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return `${h}h ${m}m layover`;
}

/* Fake barcode */
function Barcode({ value, light }: { value: string; light?: boolean }) {
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 56 }, (_, i) => ({
    w: ((seed * (i + 7) * 13) % 3) + 1,
    gap: ((seed * (i + 3) * 17) % 4) + 1,
  }));
  const color = light ? "rgba(0,0,0,0.7)" : "#fff";
  return (
    <div className="flex items-end h-12 px-2">
      {bars.map((b, i) => (
        <div key={i} style={{ width: b.w, height: 36 + (i % 3) * 5, marginRight: b.gap, background: color, borderRadius: 1, flexShrink: 0 }} />
      ))}
    </div>
  );
}

/* ── Flight fullscreen present modal ── */
function FlightPresentModal({ flight, onClose }: { flight: Flight; onClose: () => void }) {
  const fromCode = flight.from.split(" ")[0];
  const toCode = flight.to.split(" ")[0];
  const fromCity = flight.from.slice(fromCode.length + 1);
  const toCity = flight.to.slice(toCode.length + 1);
  const isOnward = flight.type === "onward";
  const bg = isOnward
    ? "linear-gradient(160deg, #0369a1 0%, #0ea5e9 55%, #38bdf8 100%)"
    : "linear-gradient(160deg, #312e81 0%, #4f46e5 50%, #7c3aed 100%)";

  return (
    <div className="fixed z-50 flex flex-col overflow-y-auto scroll-hide"
      style={{ background: bg, top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430 }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 shrink-0">
        <div>
          <p className="text-[10px] font-bold tracking-[2.5px] uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
            {isOnward ? "Onward" : "Return"} · Boarding Pass
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{fmtShort(flight.date)}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Route hero */}
      <div className="flex items-center px-6 pb-5 gap-3 shrink-0">
        <div className="flex-1">
          <p className="text-[48px] font-black text-white leading-none">{fromCode}</p>
          <p className="text-[12px] font-semibold mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{fromCity}</p>
          <p className="text-[26px] font-bold text-white mt-2">{flight.departure}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Departure</p>
        </div>
        <div className="flex flex-col items-center gap-1.5 pb-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Plane size={15} className="text-white" />
          </div>
          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>via {flight.via}</p>
        </div>
        <div className="flex-1 text-right">
          <p className="text-[48px] font-black text-white leading-none">{toCode}</p>
          <p className="text-[12px] font-semibold mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{toCity}</p>
          <p className="text-[26px] font-bold text-white mt-2">{flight.arrival}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Arrival</p>
        </div>
      </div>

      {/* PNR */}
      <div className="mx-5 rounded-3xl px-5 py-4 mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.13)" }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>PNR / Booking Ref</p>
            <p className="text-[36px] font-black text-white tracking-[6px] leading-tight">{flight.pnr}</p>
            {flight.bookingRef && <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Ref: {flight.bookingRef}</p>}
          </div>
          <div className="text-right">
            {flight.airline && <p className="text-[12px] font-bold text-white">{flight.airline}</p>}
            {flight.travelClass && <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{flight.travelClass}</p>}
          </div>
        </div>
      </div>

      {/* Legs with layover */}
      {flight.legs && flight.legs.length > 0 && (
        <div className="mx-5 rounded-3xl overflow-hidden mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
          {flight.legs.map((leg, i) => (
            <div key={i}>
              <div className="px-5 py-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-bold text-white opacity-60">{leg.number}</p>
                  <div className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <Plane size={10} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-[18px] font-black text-white">{leg.from.split(" ")[0]}</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{leg.fromTerminal}</p>
                    <p className="text-[14px] font-bold text-white">{leg.departure}</p>
                  </div>
                  <ArrowRight size={14} className="text-white opacity-40 shrink-0" />
                  <div className="flex-1 text-right">
                    <p className="text-[18px] font-black text-white">{leg.to.split(" ")[0]}</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{leg.toTerminal}</p>
                    <p className="text-[14px] font-bold text-white">{leg.arrival}</p>
                  </div>
                </div>
              </div>
              {leg.layoverMinutes && (
                <div className="mx-4 py-2 flex items-center gap-2" style={{ borderTop: "1px dashed rgba(255,255,255,0.15)" }}>
                  <div className="h-px flex-1" style={{ background: "transparent" }} />
                  <p className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)" }}>
                    ⏱ {fmtLayover(leg.layoverMinutes)} at {leg.to.split(" ")[0]}
                  </p>
                  <div className="h-px flex-1" style={{ background: "transparent" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Passengers */}
      {flight.passengers && flight.passengers.length > 0 && (
        <div className="mx-5 rounded-3xl overflow-hidden mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
          <div className="px-5 py-4">
            <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
              {flight.passengers.length} Passengers
            </p>
            {flight.passengers.map((name, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2" style={{
                borderBottom: i < flight.passengers!.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none"
              }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <User size={11} className="text-white" />
                </div>
                <p className="text-[13px] font-semibold text-white">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Baggage */}
      {flight.baggage && (
        <div className="mx-5 rounded-3xl px-5 py-3.5 mb-3 flex items-center gap-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
          <Luggage size={16} className="text-white opacity-50 shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-white">Check-in {flight.baggage.checkin} · Cabin {flight.baggage.cabin}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>IndiGo Economy baggage allowance</p>
          </div>
        </div>
      )}

      {/* Barcode */}
      <div className="mx-5 rounded-3xl overflow-hidden mb-4 shrink-0" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="py-4 flex flex-col items-center">
          <Barcode value={flight.pnr} />
          <p className="text-[10px] font-mono mt-2.5" style={{ color: "rgba(255,255,255,0.35)" }}>{flight.pnr} · {flight.number}</p>
        </div>
      </div>

      {/* PDF button + hint */}
      <div className="px-5 pb-10 shrink-0 flex flex-col items-center gap-3">
        {flight.pdfUrl && (
          <a href={flight.pdfUrl} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 font-bold text-[14px] py-3.5 rounded-2xl tap-active"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
            <FileText size={16} />
            View Official PDF Ticket
          </a>
        )}
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Show this screen or the PDF at the airline counter
        </p>
      </div>
    </div>
  );
}

/* ── Activity fullscreen modal ── */
function ActivityPresentModal({ ticket, onClose }: { ticket: TicketType; onClose: () => void }) {
  return (
    <div className="fixed z-50 flex flex-col overflow-y-auto scroll-hide"
      style={{ background: "linear-gradient(160deg, #1a2744 0%, #1e3a6e 55%, #2563eb 100%)", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430 }}>
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <div>
          <p className="text-[10px] font-bold tracking-[2.5px] uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Activity Pass</p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{fmtDate(ticket.date)}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <X size={18} className="text-white" />
        </button>
      </div>
      <div className="px-6 pb-5">
        <p className="text-[44px]">🚡</p>
        <h2 className="text-[26px] font-black text-white leading-snug mt-2">{ticket.activity}</h2>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.12)" }}>
          <Clock size={14} className="text-white opacity-60" />
          <p className="text-[16px] font-bold text-white">{ticket.slot}</p>
        </div>
      </div>
      <div className="mx-5 rounded-3xl overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.10)" }}>
        <div className="px-5 py-4">
          <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            {ticket.passengers.length} Passengers
          </p>
          {ticket.passengers.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2.5" style={{
              borderBottom: i < ticket.passengers.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none"
            }}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <User size={11} className="text-white" />
                </div>
                <p className="text-[13px] font-semibold text-white">{p.name}</p>
              </div>
              <p className="font-mono text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>#{p.ticket}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-5 rounded-3xl overflow-hidden mb-4" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="py-4 flex flex-col items-center">
          <Barcode value={ticket.passengers[0]?.ticket ?? "GONDOLA"} />
          <p className="text-[10px] font-mono mt-2.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            #{ticket.passengers[0]?.ticket} · {ticket.activity}
          </p>
        </div>
      </div>
      <p className="text-center text-[11px] pb-10" style={{ color: "rgba(255,255,255,0.3)" }}>Show at the gondola counter</p>
    </div>
  );
}

/* ── Compact flight card ── */
function FlightCard({ flight, onPresent }: { flight: Flight; onPresent: () => void }) {
  const fromCode = flight.from.split(" ")[0];
  const toCode = flight.to.split(" ")[0];
  const isOnward = flight.type === "onward";
  const hasLayover = (flight.legs?.length ?? 0) > 1;

  return (
    <div className="rounded-4xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
      <div className="px-5 py-5" style={{
        background: isOnward
          ? "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)"
          : "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)"
      }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base">✈️</span>
            <span className="text-[10px] font-bold tracking-[2px] uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>
              {isOnward ? "Onward Flight" : "Return Flight"}
              {hasLayover && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>1 stop</span>}
            </span>
          </div>
          <span className="text-[16px] font-bold text-white tracking-widest">{flight.pnr}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[26px] font-black text-white">{flight.departure}</p>
            <p className="text-[14px] font-bold text-white mt-0.5">{fromCode}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{flight.from.slice(fromCode.length + 1)}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.3)" }} />
            <Plane size={12} className="text-white opacity-60" />
            <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.3)" }} />
            {hasLayover && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>via {flight.via}</p>}
          </div>
          <div className="flex-1 text-right">
            <p className="text-[26px] font-black text-white">{flight.arrival}</p>
            <p className="text-[14px] font-bold text-white mt-0.5">{toCode}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{flight.to.slice(toCode.length + 1)}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center" style={{ background: "#f7f7f5" }}>
        <div className="w-5 h-5 rounded-full -ml-2.5 shrink-0" style={{ background: "#f7f7f5", border: "1.5px solid rgba(0,0,0,0.08)" }} />
        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: "rgba(0,0,0,0.08)" }} />
        <div className="w-5 h-5 rounded-full -mr-2.5 shrink-0" style={{ background: "#f7f7f5", border: "1.5px solid rgba(0,0,0,0.08)" }} />
      </div>
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#fff" }}>
        <div>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: "#9ca3af" }}>Date · Flights</p>
          <p className="text-[13px] font-bold text-[#111827]">{fmtShort(flight.date)} · {flight.number}</p>
        </div>
        <button onClick={onPresent} className="flex items-center gap-1.5 font-bold text-[12px] px-4 py-2.5 rounded-2xl tap-active"
          style={{ background: "#eff6ff", color: "#2563eb" }}>
          <Maximize2 size={13} /> Show
        </button>
      </div>
    </div>
  );
}

/* ── Compact activity card ── */
function ActivityCard({ ticket, onPresent }: { ticket: TicketType; onPresent: () => void }) {
  return (
    <div className="rounded-4xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
      <div className="px-5 py-5" style={{ background: "linear-gradient(135deg, #1a2744 0%, #1e3a6e 100%)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🚡</span>
          <span className="text-[10px] font-bold tracking-[2px] uppercase" style={{ color: "#fbbf24" }}>Activity Pass</span>
        </div>
        <h3 className="text-[18px] font-bold text-white">{ticket.activity}</h3>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5" style={{ color: "#93c5fd" }}>
            <Clock size={12} /><p className="text-[13px] font-semibold">{ticket.slot}</p>
          </div>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>{fmtShort(ticket.date)}</p>
        </div>
      </div>
      <div className="flex items-center" style={{ background: "#f7f7f5" }}>
        <div className="w-5 h-5 rounded-full -ml-2.5 shrink-0" style={{ background: "#f7f7f5", border: "1.5px solid rgba(0,0,0,0.08)" }} />
        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: "rgba(0,0,0,0.08)" }} />
        <div className="w-5 h-5 rounded-full -mr-2.5 shrink-0" style={{ background: "#f7f7f5", border: "1.5px solid rgba(0,0,0,0.08)" }} />
      </div>
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#fff" }}>
        <div className="flex items-center gap-2">
          <User size={13} style={{ color: "#9ca3af" }} />
          <p className="text-[13px] font-semibold text-[#111827]">{ticket.passengers.length} passengers</p>
        </div>
        <button onClick={onPresent} className="flex items-center gap-1.5 font-bold text-[12px] px-4 py-2.5 rounded-2xl tap-active"
          style={{ background: "#eff6ff", color: "#2563eb" }}>
          <Maximize2 size={13} /> Show
        </button>
      </div>
    </div>
  );
}

export default function TicketsScreen({ tickets, flights }: { tickets: TicketType[]; flights: Flight[] }) {
  const [presenting, setPresenting] = useState<{ type: "flight"; idx: number } | { type: "activity"; idx: number } | null>(null);

  return (
    <>
      {presenting?.type === "flight" && (
        <FlightPresentModal flight={flights[presenting.idx]} onClose={() => setPresenting(null)} />
      )}
      {presenting?.type === "activity" && (
        <ActivityPresentModal ticket={tickets[presenting.idx]} onClose={() => setPresenting(null)} />
      )}

      <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
        <div className="px-5 pt-12 pb-5">
          <p className="text-[12px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>{tickets.length + flights.length} passes</p>
          <h2 className="text-[26px] font-bold text-[#111827]">My Tickets</h2>
          <p className="text-[12px] mt-1" style={{ color: "#9ca3af" }}>Tap <strong style={{ color: "#2563eb" }}>Show</strong> to present at counter</p>
        </div>
        <div className="px-4 pb-8 flex flex-col gap-5">
          {flights.map((f, i) => (
            <FlightCard key={i} flight={f} onPresent={() => setPresenting({ type: "flight", idx: i })} />
          ))}
          {tickets.map((t, i) => (
            <ActivityCard key={i} ticket={t} onPresent={() => setPresenting({ type: "activity", idx: i })} />
          ))}
        </div>
      </div>
    </>
  );
}
