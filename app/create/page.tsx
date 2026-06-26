"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Upload, Keyboard, Mail, Check, Plus, X, Share2, ArrowRight,
  Loader2
} from "lucide-react";
import { Pass, Hotel as HotelType, PassType } from "@/lib/types";
import { UserTrip, saveUserTrip, generateId, generateShareToken } from "@/lib/user-trips";

/* ── Helpers ── */
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 30) || generateId();
}

const PASS_COLORS: Record<PassType, string> = {
  flight: "#0369a1",
  train: "#b45309",
  bus: "#15803d",
  boat: "#0e7490",
  activity: "#1a2744",
  hotel_voucher: "#7c3aed",
  other: "#374151",
};

const PASS_EMOJI: Record<PassType, string> = {
  flight: "✈️", train: "🚂", bus: "🚌", boat: "⛵", activity: "🎡", hotel_voucher: "🏨", other: "🎫",
};

/* ── Step 1: Basics ── */
function StepBasics({ onNext }: { onNext: (name: string, dest: string, start: string, end: string) => void }) {
  const [name, setName] = useState("");
  const [dest, setDest] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const valid = name.trim() && start && end && end >= start;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-10 pb-6">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>Step 1 of 3</p>
        <h2 className="text-[26px] font-bold text-[#111827]">Name your trip</h2>
        <p className="text-[13px] mt-1" style={{ color: "#9ca3af" }}>No account needed — just start.</p>
      </div>

      <div className="px-5 flex flex-col gap-4 flex-1">
        <div>
          <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Trip name</label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Goa trip Dec 2026"
            className="w-full px-4 py-3.5 rounded-2xl text-[15px] font-semibold outline-none"
            style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }}
          />
        </div>
        <div>
          <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Destination (optional)</label>
          <input
            value={dest} onChange={e => setDest(e.target.value)}
            placeholder="Goa · Mumbai"
            className="w-full px-4 py-3.5 rounded-2xl text-[15px] outline-none"
            style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Start date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl text-[14px] outline-none"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>End date</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl text-[14px] outline-none"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
          </div>
        </div>
      </div>

      <div className="px-5 pb-10">
        <button
          disabled={!valid}
          onClick={() => onNext(name.trim(), dest.trim(), start, end)}
          className="w-full py-4 rounded-2xl text-[15px] font-bold text-white tap-active"
          style={{ background: valid ? "#1a2744" : "#e5e7eb", color: valid ? "#fff" : "#9ca3af" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

/* ── Step 2: Add bookings ── */
type AddMethod = null | "upload" | "manual" | "email";


function ManualPassForm({ onAdd, onBack }: { onAdd: (pass: Pass) => void; onBack: () => void }) {
  const [type, setType] = useState<PassType>("flight");
  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [ref, setRef] = useState("");
  const [operator, setOperator] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");

  const TYPES: { id: PassType; label: string; emoji: string }[] = [
    { id: "flight", label: "Flight", emoji: "✈️" },
    { id: "train", label: "Train", emoji: "🚂" },
    { id: "bus", label: "Bus", emoji: "🚌" },
    { id: "activity", label: "Activity", emoji: "🎡" },
    { id: "other", label: "Other", emoji: "🎫" },
  ];

  const isTransport = ["flight", "train", "bus", "boat"].includes(type);

  function submit() {
    const pass: Pass = {
      id: generateId(),
      type,
      title: title || (from && to ? `${from} → ${to}` : title),
      from: from || undefined,
      to: to || undefined,
      date,
      reference: ref,
      operator: operator || undefined,
      departure: departure || undefined,
      arrival: arrival || undefined,
    };
    onAdd(pass);
  }

  const valid = date && ref && (title || (from && to));

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-hide">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center tap-active" style={{ background: "#f7f7f5" }}>
          <ChevronLeft size={16} style={{ color: "#6b7280" }} />
        </button>
        <h3 className="text-[17px] font-bold text-[#111827]">Enter manually</h3>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-6">
        <div>
          <label className="text-[11px] font-bold tracking-wide uppercase block mb-2" style={{ color: "#9ca3af" }}>Type</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold tap-active"
                style={{
                  background: type === t.id ? "#1a2744" : "#f7f7f5",
                  color: type === t.id ? "#fff" : "#374151",
                }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {isTransport ? (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>From</label>
              <input value={from} onChange={e => setFrom(e.target.value)} placeholder="IXU Aurangabad"
                className="w-full px-3 py-3 rounded-xl text-[13px] outline-none"
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>To</label>
              <input value={to} onChange={e => setTo(e.target.value)} placeholder="SXR Srinagar"
                className="w-full px-3 py-3 rounded-xl text-[13px] outline-none"
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
          </div>
        ) : (
          <div>
            <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Gulmarg Gondola"
              className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
          </div>
        )}

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-3 rounded-xl text-[13px] outline-none"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Reference / PNR</label>
            <input value={ref} onChange={e => setRef(e.target.value)} placeholder="B417MY"
              className="w-full px-3 py-3 rounded-xl text-[13px] font-mono outline-none"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
          </div>
        </div>

        {isTransport && (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Departure</label>
              <input type="time" value={departure} onChange={e => setDeparture(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-[13px] outline-none"
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Arrival</label>
              <input type="time" value={arrival} onChange={e => setArrival(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-[13px] outline-none"
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
          </div>
        )}

        <div>
          <label className="text-[11px] font-bold tracking-wide uppercase block mb-1.5" style={{ color: "#9ca3af" }}>Operator (optional)</label>
          <input value={operator} onChange={e => setOperator(e.target.value)} placeholder="IndiGo, IRCTC, redBus..."
            className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
            style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }} />
        </div>

        <button disabled={!valid} onClick={submit}
          className="w-full py-4 rounded-2xl text-[15px] font-bold tap-active"
          style={{ background: valid ? "#1a2744" : "#e5e7eb", color: valid ? "#fff" : "#9ca3af" }}>
          Add booking
        </button>
      </div>
    </div>
  );
}

function UploadFlow({ onAdd, onBack }: { onAdd: (pass: Pass | HotelType) => void; onBack: () => void }) {
  const [state, setState] = useState<"idle" | "parsing" | "review" | "error">("idle");
  const [parsed, setParsed] = useState<Record<string, unknown> | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function parseContent(body: Record<string, unknown>) {
    setState("parsing");
    try {
      const res = await fetch("/api/parse-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) { setErrorMsg(data.error); setState("error"); return; }
      setParsed(data);
      setState("review");
    } catch {
      setErrorMsg("Something went wrong. Try again.");
      setState("error");
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await parseContent({ imageBase64: base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  }

  async function handlePaste() {
    if (!pastedText.trim()) return;
    await parseContent({ text: pastedText });
  }

  function confirmParsed() {
    if (!parsed) return;
    if (parsed.type === "hotel") {
      onAdd(parsed as unknown as HotelType);
    } else {
      const pass: Pass = {
        id: generateId(),
        type: (parsed.type as PassType) ?? "other",
        title: (parsed.title as string) ?? "",
        from: parsed.from as string | undefined,
        to: parsed.to as string | undefined,
        via: parsed.via as string | undefined,
        departure: parsed.departure as string | undefined,
        arrival: parsed.arrival as string | undefined,
        date: parsed.date as string,
        reference: parsed.reference as string,
        operator: parsed.operator as string | undefined,
        flightNumber: parsed.flightNumber as string | undefined,
        travelClass: parsed.travelClass as string | undefined,
        baggage: parsed.baggage as Pass["baggage"],
        passengers: parsed.passengers as string[] | undefined,
        legs: parsed.legs as Pass["legs"],
        slot: parsed.slot as string | undefined,
        subtype: parsed.subtype as Pass["subtype"],
      };
      onAdd(pass);
    }
  }

  if (state === "parsing") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 size={32} style={{ color: "#2563eb" }} className="animate-spin" />
        <p className="text-[14px] font-semibold text-[#111827]">Reading your booking...</p>
        <p className="text-[12px]" style={{ color: "#9ca3af" }}>Claude is extracting the details</p>
      </div>
    );
  }

  if (state === "review" && parsed) {
    const isHotel = parsed.type === "hotel";
    const color = isHotel ? "#7c3aed" : PASS_COLORS[(parsed.type as PassType) ?? "other"];
    const emoji = isHotel ? "🏨" : PASS_EMOJI[(parsed.type as PassType) ?? "other"];

    return (
      <div className="flex flex-col h-full overflow-y-auto scroll-hide">
        <div className="px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background: color + "20" }}>{emoji}</div>
            <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#9ca3af" }}>AI extracted · review & confirm</p>
          </div>
          <h3 className="text-[18px] font-bold text-[#111827]">{(parsed.title ?? parsed.name) as string}</h3>
        </div>

        <div className="mx-5 rounded-3xl overflow-hidden mb-4" style={{ border: "1.5px solid #e5e7eb", background: "#fff" }}>
          {Object.entries(parsed)
            .filter(([k]) => !["type", "legs", "activityPassengers"].includes(k))
            .map(([k, v]) => v ? (
              <div key={k} className="flex items-start justify-between px-5 py-3.5"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#9ca3af", minWidth: 90 }}>
                  {k.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-[13px] font-semibold text-[#111827] text-right flex-1 ml-4">
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </p>
              </div>
            ) : null)}
        </div>

        {Array.isArray(parsed.legs) && (parsed.legs as unknown[]).length > 0 && (
          <div className="mx-5 mb-4">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9ca3af" }}>Flight legs</p>
            {(parsed.legs as Record<string, unknown>[]).map((leg, i) => (
              <div key={i} className="rounded-2xl px-4 py-3 mb-2 flex items-center gap-2" style={{ background: "#eff6ff" }}>
                <p className="text-[11px] font-bold text-[#1e40af]">{String(leg.number ?? "")}</p>
                <ArrowRight size={12} style={{ color: "#93c5fd" }} />
                <p className="text-[11px] text-[#1e40af]">{String(leg.from ?? "")} → {String(leg.to ?? "")}</p>
                <p className="text-[11px] ml-auto text-[#1e40af]">{String(leg.departure ?? "")} – {String(leg.arrival ?? "")}</p>
              </div>
            ))}
          </div>
        )}

        <div className="px-5 flex gap-3 pb-8 shrink-0">
          <button onClick={() => { setState("idle"); setParsed(null); }}
            className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold tap-active"
            style={{ background: "#f7f7f5", color: "#374151" }}>
            Re-upload
          </button>
          <button onClick={confirmParsed}
            className="flex-2 py-3.5 px-6 rounded-2xl text-[13px] font-bold text-white tap-active"
            style={{ background: "#16a34a" }}>
            <Check size={14} className="inline mr-1" /> Confirm & Add
          </button>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
        <p className="text-3xl">😕</p>
        <p className="text-[15px] font-bold text-[#111827]">{errorMsg}</p>
        <button onClick={() => setState("idle")} className="px-6 py-3 rounded-2xl font-bold text-white tap-active" style={{ background: "#1a2744" }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-hide">
      <div className="px-5 pt-6 pb-2 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center tap-active" style={{ background: "#f7f7f5" }}>
          <ChevronLeft size={16} style={{ color: "#6b7280" }} />
        </button>
        <h3 className="text-[17px] font-bold text-[#111827]">Upload booking</h3>
      </div>

      <div className="px-5 flex flex-col gap-3 pb-6">
        <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />

        <button onClick={() => fileRef.current?.click()}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl tap-active"
          style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
            <Upload size={18} style={{ color: "#2563eb" }} />
          </div>
          <div className="text-left">
            <p className="text-[14px] font-bold text-[#111827]">Upload screenshot or PDF</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>IndiGo, IRCTC, MakeMyTrip, redBus, Goibibo...</p>
          </div>
        </button>

        <button onClick={() => setShowPaste(p => !p)}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl tap-active"
          style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#f0fdf4" }}>
            <Keyboard size={18} style={{ color: "#16a34a" }} />
          </div>
          <div className="text-left">
            <p className="text-[14px] font-bold text-[#111827]">Paste booking text</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>Copy from email or SMS and paste here</p>
          </div>
        </button>

        {showPaste && (
          <div className="flex flex-col gap-2">
            <textarea
              value={pastedText} onChange={e => setPastedText(e.target.value)}
              placeholder="Paste your booking confirmation here..."
              rows={6}
              className="w-full px-4 py-3 rounded-2xl text-[13px] outline-none resize-none"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#111827" }}
            />
            <button onClick={handlePaste} disabled={!pastedText.trim()}
              className="w-full py-3 rounded-2xl text-[13px] font-bold text-white tap-active"
              style={{ background: pastedText.trim() ? "#1a2744" : "#e5e7eb", color: pastedText.trim() ? "#fff" : "#9ca3af" }}>
              Parse with AI →
            </button>
          </div>
        )}

        <div className="rounded-2xl px-4 py-3.5 flex items-start gap-3" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <Mail size={16} style={{ color: "#2563eb", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[12px] font-bold" style={{ color: "#1e40af" }}>Or forward your booking email to:</p>
            <p className="text-[13px] font-mono font-bold mt-1" style={{ color: "#1d4ed8" }}>trips@howstrip.com</p>
            <p className="text-[11px] mt-1" style={{ color: "#3b82f6" }}>{"We'll parse it and add it to your trip automatically."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepAddBookings({
  passes, hotels, onAddPass, onAddHotel, onRemovePass, onDone
}: {
  passes: Pass[];
  hotels: HotelType[];
  onAddPass: (p: Pass) => void;
  onAddHotel: (h: HotelType) => void;
  onRemovePass: (id: string) => void;
  onDone: () => void;
}) {
  const [method, setMethod] = useState<AddMethod>(null);

  function handleAdd(item: Pass | HotelType) {
    if ("check_in" in item) {
      onAddHotel(item as HotelType);
    } else {
      onAddPass(item as Pass);
    }
    setMethod(null);
  }

  if (method === "upload") return <UploadFlow onAdd={handleAdd} onBack={() => setMethod(null)} />;
  if (method === "manual") return <ManualPassForm onAdd={p => { onAddPass(p); setMethod(null); }} onBack={() => setMethod(null)} />;

  const total = passes.length + hotels.length;

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-hide">
      <div className="px-5 pt-10 pb-5 shrink-0">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>Step 2 of 3</p>
        <h2 className="text-[26px] font-bold text-[#111827]">Add your bookings</h2>
        <p className="text-[13px] mt-1" style={{ color: "#9ca3af" }}>{"Flights, trains, hotels, activities — anything you've booked."}</p>
      </div>

      {/* Added passes */}
      {total > 0 && (
        <div className="px-4 mb-3">
          {passes.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-2"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
              <span className="text-lg shrink-0">{PASS_EMOJI[p.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#111827] truncate">{p.title}</p>
                <p className="text-[11px]" style={{ color: "#9ca3af" }}>{p.date} · {p.reference}</p>
              </div>
              <button onClick={() => onRemovePass(p.id)} className="tap-active">
                <X size={14} style={{ color: "#9ca3af" }} />
              </button>
            </div>
          ))}
          {hotels.map((h, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-2"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
              <span className="text-lg shrink-0">🏨</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#111827] truncate">{h.name}</p>
                <p className="text-[11px]" style={{ color: "#9ca3af" }}>{h.check_in} → {h.check_out}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add methods */}
      <div className="px-4 flex flex-col gap-2">
        <button onClick={() => setMethod("upload")}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl tap-active"
          style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
            <Upload size={18} style={{ color: "#2563eb" }} />
          </div>
          <div className="text-left flex-1">
            <p className="text-[14px] font-bold text-[#111827]">Upload or paste booking</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>PDF, screenshot, or paste text — AI parses it</p>
          </div>
          <ArrowRight size={14} style={{ color: "#d1d5db" }} />
        </button>

        <button onClick={() => setMethod("manual")}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl tap-active"
          style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#f0fdf4" }}>
            <Keyboard size={18} style={{ color: "#16a34a" }} />
          </div>
          <div className="text-left flex-1">
            <p className="text-[14px] font-bold text-[#111827]">Enter manually</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>Type in the details yourself</p>
          </div>
          <ArrowRight size={14} style={{ color: "#d1d5db" }} />
        </button>

        <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <Mail size={15} style={{ color: "#2563eb", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[12px] font-bold" style={{ color: "#1e40af" }}>Forward emails to</p>
            <p className="text-[13px] font-mono font-bold" style={{ color: "#1d4ed8" }}>trips@howstrip.com</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5 pb-10 shrink-0">
        {total > 0 && (
          <button onClick={onDone}
            className="w-full py-4 rounded-2xl text-[15px] font-bold text-white tap-active mb-3"
            style={{ background: "#1a2744" }}>
            Done, build my trip →
          </button>
        )}
        {total === 0 && (
          <button onClick={onDone}
            className="w-full py-4 rounded-2xl text-[14px] font-bold tap-active"
            style={{ background: "#f7f7f5", color: "#9ca3af" }}>
            Skip for now →
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Step 3: Share ── */
function StepShare({ trip, onAddMore }: { trip: UserTrip; onAddMore: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/t/${trip.share_token}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`Join my trip "${trip.name}" on Howstrip: ${url}`)}`;

  function copy() {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  const total = trip.passes.length + trip.hotels.length;

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-hide">
      <div className="px-5 pt-10 pb-6 shrink-0">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>Step 3 of 3</p>
        <h2 className="text-[26px] font-bold text-[#111827]">Your trip is ready!</h2>
        <p className="text-[13px] mt-1" style={{ color: "#9ca3af" }}>
          {total} {total === 1 ? "booking" : "bookings"} added · Share the link with your travel companions.
        </p>
      </div>

      {/* Trip card preview */}
      <div className="mx-4 rounded-3xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #1a2744, #1e3a6e)" }}>
        <div className="px-5 pt-5 pb-5">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            {trip.start_date} → {trip.end_date}
          </p>
          <h3 className="text-[22px] font-bold text-white">{trip.name}</h3>
          {trip.destination && <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{trip.destination}</p>}
          <div className="flex gap-2 mt-4 flex-wrap">
            {trip.passes.slice(0, 4).map(p => (
              <span key={p.id} className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                {PASS_EMOJI[p.type]} {p.title}
              </span>
            ))}
            {trip.hotels.slice(0, 2).map((h, i) => (
              <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                🏨 {h.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Share link */}
      <div className="mx-4 rounded-3xl px-5 py-4 mb-3" style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9ca3af" }}>Your trip link</p>
        <div className="flex items-center gap-3">
          <p className="text-[12px] font-mono flex-1 truncate" style={{ color: "#374151" }}>{url}</p>
          <button onClick={copy} className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[11px] tap-active shrink-0"
            style={{ background: copied ? "#dcfce7" : "#eff6ff", color: copied ? "#16a34a" : "#2563eb" }}>
            {copied ? <Check size={12} /> : <Share2 size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-2 pb-4">
        <a href={waUrl} target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white tap-active"
          style={{ background: "#16a34a" }}>
          <span>📱</span> Share on WhatsApp
        </a>
        <button onClick={onAddMore}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold tap-active"
          style={{ background: "#f7f7f5", color: "#374151" }}>
          <Plus size={14} /> Add more bookings
        </button>
      </div>

      <div className="mx-4 rounded-2xl px-4 py-3 mb-10" style={{ background: "#f0fdf4" }}>
        <p className="text-[11px]" style={{ color: "#16a34a" }}>
          🔒 Only people with the link can view. No sign-up needed for viewers.
        </p>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function CreateTripPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tripMeta, setTripMeta] = useState<{ name: string; dest: string; start: string; end: string } | null>(null);
  const [passes, setPasses] = useState<Pass[]>([]);
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [savedTrip, setSavedTrip] = useState<UserTrip | null>(null);

  function handleBasics(name: string, dest: string, start: string, end: string) {
    setTripMeta({ name, dest, start, end });
    setStep(2);
  }

  function handleDone() {
    if (!tripMeta) return;
    const trip: UserTrip = {
      id: slugify(tripMeta.name),
      name: tripMeta.name,
      destination: tripMeta.dest,
      start_date: tripMeta.start,
      end_date: tripMeta.end,
      passes,
      hotels,
      created_at: new Date().toISOString().split("T")[0],
      share_token: generateShareToken(),
    };
    saveUserTrip(trip);
    setSavedTrip(trip);
    setStep(3);
  }

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#f7f7f5" }}>
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 pt-12 pb-2 shrink-0">
        <button onClick={() => step === 1 ? router.push("/") : setStep(s => (s - 1) as 1 | 2 | 3)}
          className="w-9 h-9 rounded-2xl flex items-center justify-center tap-active"
          style={{ background: "#fff" }}>
          <ChevronLeft size={18} style={{ color: "#6b7280" }} />
        </button>
        <div className="flex-1 flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all"
              style={{ background: s <= step ? "#1a2744" : "#e5e7eb" }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {step === 1 && <StepBasics onNext={handleBasics} />}
        {step === 2 && (
          <StepAddBookings
            passes={passes}
            hotels={hotels}
            onAddPass={p => setPasses(prev => [...prev, p])}
            onAddHotel={h => setHotels(prev => [...prev, h])}
            onRemovePass={id => setPasses(prev => prev.filter(p => p.id !== id))}
            onDone={handleDone}
          />
        )}
        {step === 3 && savedTrip && (
          <StepShare trip={savedTrip} onAddMore={() => setStep(2)} />
        )}
      </div>
    </div>
  );
}
