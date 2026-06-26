"use client";

import { useState } from "react";
import { X, Maximize2, Plane, Bus, Train, Ship, Ticket, Hotel, ArrowRight, Clock, User, Luggage, FileText, ExternalLink } from "lucide-react";
import { Pass, PassType, TripDocument, Trip } from "@/lib/types";

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

const PASS_CONFIG: Record<PassType, { icon: React.ElementType; emoji: string; label: string; gradient: string }> = {
  flight:        { icon: Plane,   emoji: "✈️", label: "Flight",        gradient: "linear-gradient(160deg, #0369a1 0%, #0ea5e9 100%)" },
  bus:           { icon: Bus,     emoji: "🚌", label: "Bus",           gradient: "linear-gradient(160deg, #15803d 0%, #22c55e 100%)" },
  train:         { icon: Train,   emoji: "🚂", label: "Train",         gradient: "linear-gradient(160deg, #b45309 0%, #f59e0b 100%)" },
  boat:          { icon: Ship,    emoji: "⛵", label: "Boat",          gradient: "linear-gradient(160deg, #0e7490 0%, #06b6d4 100%)" },
  activity:      { icon: Ticket,  emoji: "🎡", label: "Activity Pass", gradient: "linear-gradient(160deg, #1a2744 0%, #2563eb 100%)" },
  hotel_voucher: { icon: Hotel,   emoji: "🏨", label: "Hotel Voucher", gradient: "linear-gradient(160deg, #7c3aed 0%, #a78bfa 100%)" },
  other:         { icon: Ticket,  emoji: "🎫", label: "Pass",          gradient: "linear-gradient(160deg, #374151 0%, #6b7280 100%)" },
};

function passGradient(pass: Pass) {
  if (pass.type === "flight" && pass.subtype === "return")
    return "linear-gradient(160deg, #312e81 0%, #4f46e5 100%)";
  return PASS_CONFIG[pass.type].gradient;
}

function Barcode({ value }: { value: string }) {
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 56 }, (_, i) => ({
    w: ((seed * (i + 7) * 13) % 3) + 1,
    gap: ((seed * (i + 3) * 17) % 4) + 1,
  }));
  return (
    <div className="flex items-end h-12 px-2">
      {bars.map((b, i) => (
        <div key={i} style={{ width: b.w, height: 36 + (i % 3) * 5, marginRight: b.gap, background: "rgba(255,255,255,0.75)", borderRadius: 1, flexShrink: 0 }} />
      ))}
    </div>
  );
}

function PresentModal({ pass, onClose }: { pass: Pass; onClose: () => void }) {
  const cfg = PASS_CONFIG[pass.type];
  const gradient = passGradient(pass);
  const fromCode = pass.from?.split(" ")[0] ?? "";
  const toCode = pass.to?.split(" ")[0] ?? "";
  const fromCity = pass.from?.slice(fromCode.length + 1) ?? "";
  const toCity = pass.to?.slice(toCode.length + 1) ?? "";

  return (
    <div className="fixed z-50 flex flex-col overflow-y-auto scroll-hide"
      style={{ background: gradient, top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430 }}>

      <div className="flex items-center justify-between px-6 pt-12 pb-4 shrink-0">
        <div>
          <p className="text-[10px] font-bold tracking-[2.5px] uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
            {pass.subtype === "onward" ? "Onward · " : pass.subtype === "return" ? "Return · " : ""}{cfg.label}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{fmtDate(pass.date)}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <X size={18} className="text-white" />
        </button>
      </div>

      {pass.from && pass.to ? (
        <div className="flex items-center px-6 pb-5 gap-3 shrink-0">
          <div className="flex-1">
            <p className="text-[48px] font-black text-white leading-none">{fromCode}</p>
            <p className="text-[12px] font-semibold mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{fromCity}</p>
            {pass.departure && <>
              <p className="text-[26px] font-bold text-white mt-2">{pass.departure}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Departure</p>
            </>}
          </div>
          <div className="flex flex-col items-center gap-1.5 pb-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <cfg.icon size={15} className="text-white" />
            </div>
            {pass.via && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>via {pass.via}</p>}
          </div>
          <div className="flex-1 text-right">
            <p className="text-[48px] font-black text-white leading-none">{toCode}</p>
            <p className="text-[12px] font-semibold mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{toCity}</p>
            {pass.arrival && <>
              <p className="text-[26px] font-bold text-white mt-2">{pass.arrival}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Arrival</p>
            </>}
          </div>
        </div>
      ) : (
        <div className="px-6 pb-5 shrink-0">
          <p className="text-[40px] mb-2">{cfg.emoji}</p>
          <h2 className="text-[26px] font-black text-white leading-snug">{pass.title}</h2>
          {pass.slot && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.12)" }}>
              <Clock size={14} className="text-white opacity-60" />
              <p className="text-[16px] font-bold text-white">{pass.slot}</p>
            </div>
          )}
        </div>
      )}

      <div className="mx-5 rounded-3xl px-5 py-4 mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.13)" }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
              {pass.type === "flight" ? "PNR / Booking Ref" : "Booking Reference"}
            </p>
            <p className="text-[32px] font-black text-white tracking-[4px] leading-tight">{pass.reference}</p>
          </div>
          <div className="text-right">
            {pass.operator && <p className="text-[12px] font-bold text-white">{pass.operator}</p>}
            {pass.travelClass && <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{pass.travelClass}</p>}
          </div>
        </div>
      </div>

      {pass.legs && pass.legs.length > 0 && (
        <div className="mx-5 rounded-3xl overflow-hidden mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
          {pass.legs.map((leg, i) => (
            <div key={i}>
              <div className="px-5 py-3.5">
                <p className="text-[10px] font-bold text-white opacity-60 mb-1.5">{leg.number}</p>
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
                  <div className="flex-1" />
                  <p className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)" }}>
                    ⏱ {fmtLayover(leg.layoverMinutes)} at {leg.to.split(" ")[0]}
                  </p>
                  <div className="flex-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pass.passengers && pass.passengers.length > 0 && (
        <div className="mx-5 rounded-3xl overflow-hidden mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
          <div className="px-5 py-4">
            <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{pass.passengers.length} Passengers</p>
            {pass.passengers.map((name, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2"
                style={{ borderBottom: i < pass.passengers!.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <User size={11} className="text-white" />
                </div>
                <p className="text-[13px] font-semibold text-white">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pass.activityPassengers && pass.activityPassengers.length > 0 && (
        <div className="mx-5 rounded-3xl overflow-hidden mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
          <div className="px-5 py-4">
            <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{pass.activityPassengers.length} Passengers</p>
            {pass.activityPassengers.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < pass.activityPassengers!.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
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
      )}

      {pass.baggage && (
        <div className="mx-5 rounded-3xl px-5 py-3.5 mb-3 flex items-center gap-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
          <Luggage size={16} className="text-white opacity-50 shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-white">Check-in {pass.baggage.checkin} · Cabin {pass.baggage.cabin}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{pass.operator} baggage allowance</p>
          </div>
        </div>
      )}

      {pass.notes && (
        <div className="mx-5 rounded-3xl px-5 py-3.5 mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
          <p className="text-[12px] text-white opacity-70 leading-relaxed">{pass.notes}</p>
        </div>
      )}

      <div className="mx-5 rounded-3xl overflow-hidden mb-4 shrink-0" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="py-4 flex flex-col items-center">
          <Barcode value={pass.reference} />
          <p className="text-[10px] font-mono mt-2.5" style={{ color: "rgba(255,255,255,0.35)" }}>{pass.reference}</p>
        </div>
      </div>

      <div className="px-5 pb-10 shrink-0 flex flex-col items-center gap-3">
        {pass.pdfUrl && (
          <a href={pass.pdfUrl} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 font-bold text-[14px] py-3.5 rounded-2xl tap-active"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
            <FileText size={16} /> View Official PDF
          </a>
        )}
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>Show this screen at the counter</p>
      </div>
    </div>
  );
}

function PassCard({ pass, onPresent }: { pass: Pass; onPresent: () => void }) {
  const cfg = PASS_CONFIG[pass.type];
  const gradient = passGradient(pass);
  const fromCode = pass.from?.split(" ")[0];
  const toCode = pass.to?.split(" ")[0];

  return (
    <div className="rounded-3xl overflow-hidden mb-4">
      <div className="px-5 py-5" style={{ background: gradient }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base">{cfg.emoji}</span>
            <span className="text-[10px] font-bold tracking-[2px] uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>
              {pass.subtype === "onward" ? "Onward · " : pass.subtype === "return" ? "Return · " : ""}{cfg.label}
              {(pass.legs?.length ?? 0) > 1 && (
                <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>1 stop</span>
              )}
            </span>
          </div>
          <span className="text-[15px] font-bold text-white tracking-widest">{pass.reference}</span>
        </div>

        {fromCode && toCode ? (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              {pass.departure && <p className="text-[26px] font-black text-white">{pass.departure}</p>}
              <p className="text-[14px] font-bold text-white mt-0.5">{fromCode}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{pass.from?.slice((fromCode?.length ?? 0) + 1)}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.3)" }} />
              <cfg.icon size={12} className="text-white opacity-60" />
              <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.3)" }} />
              {pass.via && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>via {pass.via}</p>}
            </div>
            <div className="flex-1 text-right">
              {pass.arrival && <p className="text-[26px] font-black text-white">{pass.arrival}</p>}
              <p className="text-[14px] font-bold text-white mt-0.5">{toCode}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{pass.to?.slice((toCode?.length ?? 0) + 1)}</p>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-[18px] font-bold text-white">{pass.title}</h3>
            {pass.slot && (
              <div className="flex items-center gap-1.5 mt-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                <Clock size={12} /><p className="text-[13px] font-semibold">{pass.slot}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tear line */}
      <div className="flex items-center" style={{ background: "#f7f7f5" }}>
        <div className="w-5 h-5 rounded-full -ml-2.5 shrink-0" style={{ background: "#f7f7f5", border: "1.5px solid rgba(0,0,0,0.08)" }} />
        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: "rgba(0,0,0,0.08)" }} />
        <div className="w-5 h-5 rounded-full -mr-2.5 shrink-0" style={{ background: "#f7f7f5", border: "1.5px solid rgba(0,0,0,0.08)" }} />
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#fff" }}>
        <div>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: "#9ca3af" }}>
            {fmtShort(pass.date)}{pass.flightNumber ? ` · ${pass.flightNumber}` : ""}
            {pass.operator ? ` · ${pass.operator}` : ""}
          </p>
          {pass.baggage && (
            <p className="text-[11px] font-semibold text-[#374151] mt-0.5">
              🧳 {pass.baggage.checkin} check-in · {pass.baggage.cabin} cabin
            </p>
          )}
          {pass.activityPassengers && (
            <p className="text-[11px] font-semibold text-[#374151] mt-0.5">
              👥 {pass.activityPassengers.length} passengers
            </p>
          )}
        </div>
        <button onClick={onPresent}
          className="flex items-center gap-1.5 font-bold text-[12px] px-4 py-2.5 rounded-2xl tap-active shrink-0"
          style={{ background: "#eff6ff", color: "#2563eb" }}>
          <Maximize2 size={13} /> Show
        </button>
      </div>
    </div>
  );
}

const TRIP_DOC_META: Record<TripDocument["type"], { emoji: string; label: string }> = {
  insurance:     { emoji: "🛡️", label: "Insurance" },
  permit:        { emoji: "📜", label: "Permit" },
  itinerary:     { emoji: "📋", label: "Itinerary" },
  hotel_voucher: { emoji: "🏨", label: "Hotel Voucher" },
  other:         { emoji: "📄", label: "Document" },
};

function TripDocCard({ doc }: { doc: TripDocument }) {
  const meta = TRIP_DOC_META[doc.type];
  const hasFile = !!doc.fileBase64;
  const hasUrl = !!doc.url;

  function open() {
    if (hasFile) {
      const w = window.open();
      w?.document.write(`<iframe src="${doc.fileBase64}" style="width:100%;height:100vh;border:none"/>`);
    } else if (hasUrl) {
      window.open(doc.url, "_blank");
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-3xl px-4 py-4 mb-3"
      style={{ background: "#fff" }}>
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[22px] shrink-0"
        style={{ background: "#f7f7f5" }}>
        {doc.emoji ?? meta.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#111827] truncate">{doc.name}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{meta.label}</p>
      </div>
      {(hasFile || hasUrl) ? (
        <button onClick={open}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl tap-active"
          style={{ background: "#eff6ff" }}>
          <ExternalLink size={12} style={{ color: "#2563eb" }} />
          <span className="text-[11px] font-bold" style={{ color: "#2563eb" }}>Open</span>
        </button>
      ) : (
        <span className="text-[11px] px-3 py-2 rounded-xl" style={{ background: "#f7f7f5", color: "#9ca3af" }}>
          Pending
        </span>
      )}
    </div>
  );
}

export default function PassesScreen({ passes, trip }: { passes: Pass[]; trip: Trip }) {
  const [presenting, setPresenting] = useState<string | null>(null);
  const presenting_pass = passes.find(p => p.id === presenting) ?? null;
  const tripDocs = trip.documents ?? [];

  return (
    <>
      {presenting_pass && <PresentModal pass={presenting_pass} onClose={() => setPresenting(null)} />}
      <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
        <div className="px-5 pt-5 pb-4">
          <h2 className="text-[22px] font-black text-[#111827]">Passes & Docs</h2>
        </div>

        {/* Passes */}
        <div className="px-4">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: "#9ca3af" }}>
            Travel passes · {passes.length}
          </p>
          {passes.map(pass => (
            <PassCard key={pass.id} pass={pass} onPresent={() => setPresenting(pass.id)} />
          ))}
        </div>

        {/* Trip Documents */}
        {tripDocs.length > 0 && (
          <div className="px-4 mt-4">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: "#9ca3af" }}>
              Trip documents · {tripDocs.length}
            </p>
            {tripDocs.map(doc => <TripDocCard key={doc.id} doc={doc} />)}
          </div>
        )}

        <div className="h-6" />
      </div>
    </>
  );
}
