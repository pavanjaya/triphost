"use client";

import { useState } from "react";
import { Phone, MapPin, Utensils, Plane, ChevronDown, ChevronUp, PhoneCall, Wifi, Copy, Check, Plus, Trash2 } from "lucide-react";
import { Trip } from "@/lib/types";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

type Section = "hotels" | "flights" | "contacts" | "expenses" | "packing";

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

      {/* Address */}
      {hotel.address && (
        <div className="flex items-start gap-2 py-2.5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <MapPin size={13} style={{ color: "#9ca3af", marginTop: 1, flexShrink: 0 }} />
          <p className="text-[12px] flex-1" style={{ color: "#6b7280" }}>{hotel.address}</p>
        </div>
      )}

      {/* WiFi */}
      {hotel.wifi_password && (
        <div className="flex items-center gap-2 py-2.5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <Wifi size={13} style={{ color: "#9ca3af", flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px]" style={{ color: "#9ca3af" }}>{hotel.wifi_name}</p>
            <p className="text-[13px] font-bold font-mono text-[#111827]">{hotel.wifi_password}</p>
          </div>
          <CopyButton text={hotel.wifi_password} />
        </div>
      )}

      <a href={mapsUrl} target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-bold tap-active mt-2"
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

/* ── Expense Tracker ── */
const EXPENSE_CATS = ["🍽 Food", "🚗 Transport", "🛍 Shopping", "🎡 Activities", "💊 Medical", "🔧 Other"];

type Expense = { id: number; amount: number; category: string; note: string };

function ExpenseTracker({ groupSize }: { groupSize: number }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState(EXPENSE_CATS[0]);
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = groupSize > 0 ? Math.round(total / groupSize) : 0;

  function add() {
    const n = parseFloat(amount);
    if (!n) return;
    setExpenses(prev => [...prev, { id: Date.now(), amount: n, category: cat, note }]);
    setAmount(""); setNote(""); setAdding(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Summary */}
      <div className="rounded-2xl p-4 flex gap-3" style={{ background: "#f7f7f5" }}>
        <div className="flex-1 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>Total spent</p>
          <p className="text-[26px] font-black text-[#111827]">₹{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="w-px" style={{ background: "#e5e7eb" }} />
        <div className="flex-1 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>Per person</p>
          <p className="text-[26px] font-black text-[#111827]">₹{perPerson.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* List */}
      {expenses.map(e => (
        <div key={e.id} className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "#f7f7f5" }}>
          <span className="text-xl shrink-0">{e.category.split(" ")[0]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#111827]">₹{e.amount.toLocaleString("en-IN")}</p>
            {e.note && <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{e.note}</p>}
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{e.category.slice(2)}</span>
          <button onClick={() => setExpenses(p => p.filter(x => x.id !== e.id))} className="tap-active" style={{ color: "#d1d5db" }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {/* Add form */}
      {adding ? (
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#f7f7f5" }}>
          <input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-[14px] font-bold outline-none"
            style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#111827" }} />
          <input type="text" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
            style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#111827" }} />
          <div className="flex flex-wrap gap-2">
            {EXPENSE_CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold tap-active"
                style={{ background: cat === c ? "#1a2744" : "#fff", color: cat === c ? "#fff" : "#6b7280", border: "1px solid #e5e7eb" }}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold tap-active" style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#6b7280" }}>Cancel</button>
            <button onClick={add} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white tap-active" style={{ background: "#1a2744" }}>Add</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold tap-active"
          style={{ background: "#1a2744", color: "#fff" }}>
          <Plus size={15} /> Add Expense
        </button>
      )}
    </div>
  );
}

/* ── Packing Checklist ── */
const PACKING_ITEMS = [
  { cat: "📄 Documents", items: ["Aadhaar / Passport", "Flight tickets (printed/saved)", "Hotel booking confirmations", "Travel insurance copy", "Emergency contact list"] },
  { cat: "👕 Clothes", items: ["Warm jacket / woollen layer", "Rain poncho or windcheater", "Comfortable walking shoes", "Warm socks (3–4 pairs)", "Casual clothes (5 days)", "Formal wear for Vaishno Devi"] },
  { cat: "💊 Medical", items: ["Basic medicines (paracetamol, ORS)", "Motion sickness tablets", "Altitude sickness pills", "Band-aids and antiseptic", "Personal prescription medicines"] },
  { cat: "📱 Electronics", items: ["Phone + charger", "Power bank", "Earphones", "Universal adapter", "Camera / GoPro"] },
  { cat: "🧴 Toiletries", items: ["Sunscreen SPF 50+", "Lip balm", "Moisturiser (cold weather)", "Sanitiser", "Wet wipes"] },
  { cat: "🎒 Extras", items: ["Cash (ATMs sparse in Kashmir)", "Dry snacks for travel days", "Reusable water bottle", "Small backpack for day trips", "Torch / headlamp"] },
];

function PackingChecklist() {
  const total = PACKING_ITEMS.flatMap(c => c.items).length;
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setChecked(prev => { const s = new Set(prev); if (s.has(key)) { s.delete(key); } else { s.add(key); } return s; });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 flex items-center justify-between" style={{ background: "#f7f7f5" }}>
        <p className="text-[13px] font-bold text-[#111827]">{checked.size} / {total} packed</p>
        <div className="flex-1 mx-3 h-2 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(checked.size / total) * 100}%`, background: "#16a34a" }} />
        </div>
        {checked.size === total && <span className="text-[12px]">✅</span>}
      </div>
      {PACKING_ITEMS.map(cat => (
        <div key={cat.cat} className="rounded-2xl overflow-hidden" style={{ background: "#f7f7f5" }}>
          <p className="px-4 pt-3 pb-2 text-[11px] font-bold" style={{ color: "#9ca3af" }}>{cat.cat}</p>
          {cat.items.map((item, i) => {
            const key = `${cat.cat}:${item}`;
            const done = checked.has(key);
            return (
              <button key={i} onClick={() => toggle(key)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left tap-active"
                style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: done ? "#16a34a" : "#fff", border: done ? "none" : "2px solid #d1d5db" }}>
                  {done && <Check size={11} className="text-white" />}
                </div>
                <p className="text-[13px]" style={{ color: done ? "#9ca3af" : "#111827", textDecoration: done ? "line-through" : "none" }}>{item}</p>
              </button>
            );
          })}
        </div>
      ))}
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
        <Accordion title="Expense Tracker" emoji="💰" id="expenses" active={active} onToggle={toggle} count={0}>
          <ExpenseTracker groupSize={trip.group_size} />
        </Accordion>
        <Accordion title="Packing Checklist" emoji="🎒" id="packing" active={active} onToggle={toggle} count={PACKING_ITEMS.flatMap(c => c.items).length}>
          <PackingChecklist />
        </Accordion>
      </div>
    </div>
  );
}
