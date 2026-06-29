"use client";

import { useState } from "react";
import { Phone, MapPin, Wifi, Copy, Check, PhoneCall, Star, Clock, Utensils } from "lucide-react";
import { Trip } from "@/lib/types";
import { getPlaceData } from "@/lib/places-data";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
function nights(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
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

function RatingBar({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={11} fill={i <= Math.round(rating) ? "#f59e0b" : "none"}
            style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }} />
        ))}
      </div>
      <span className="text-[12px] font-bold" style={{ color: "#111827" }}>{rating.toFixed(1)}</span>
      <span className="text-[11px]" style={{ color: "#9ca3af" }}>({count.toLocaleString()} reviews)</span>
    </div>
  );
}

function HotelCard({ hotel, isTonight }: { hotel: Trip["hotels"][0]; isTonight: boolean }) {
  const [open, setOpen] = useState(isTonight);
  const place = getPlaceData(hotel.name);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(hotel.name + " " + hotel.location)}`;
  const n = nights(hotel.check_in, hotel.check_out);

  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ background: "#fff", border: isTonight ? "1.5px solid #bfdbfe" : "1px solid #e5e7eb" }}>

      {/* Cover photo */}
      {place?.photo ? (
        <div className="relative" style={{ height: 140 }}>
          <img src={place.photo} alt={hotel.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
          {isTonight && (
            <div style={{ position: "absolute", top: 10, left: 12 }}>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#2563eb", color: "#fff" }}>TONIGHT</span>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
            <p className="text-[16px] font-black text-white leading-tight">{hotel.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} style={{ color: "rgba(255,255,255,0.7)" }} />
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>{hotel.location}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: isTonight ? "#eff6ff" : "#f7f7f5" }}>🏨</div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#111827] truncate">{hotel.name}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{hotel.location}</p>
          </div>
          {isTonight && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "#2563eb", color: "#fff" }}>TONIGHT</span>}
        </div>
      )}

      {/* Check-in/out strip — tap to expand */}
      <button className="w-full flex items-center justify-between px-4 py-3 tap-active"
        style={{ borderTop: "1px solid #f3f4f6" }}
        onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#9ca3af" }}>Check-in</p>
            <p className="text-[13px] font-bold" style={{ color: "#111827" }}>{fmt(hotel.check_in)}</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-px w-4" style={{ background: "#e5e7eb" }} />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#f3f4f6", color: "#6b7280" }}>{n}N</span>
            <div className="h-px w-4" style={{ background: "#e5e7eb" }} />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#9ca3af" }}>Check-out</p>
            <p className="text-[13px] font-bold" style={{ color: "#111827" }}>{fmt(hotel.check_out)}</p>
          </div>
        </div>
        <span className="text-[12px] font-semibold" style={{ color: "#2563eb" }}>{open ? "Less" : "Details"}</span>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid #f3f4f6" }}>

          {/* Rating + description */}
          {place && (
            <div className="px-4 py-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <RatingBar rating={place.rating} count={place.review_count} />
              <p className="text-[12px] leading-relaxed mt-2" style={{ color: "#6b7280" }}>{place.description}</p>
            </div>
          )}

          {/* Booking details */}
          <div className="px-4 py-3 flex items-center gap-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
            <div className="flex items-center gap-2">
              <span className="text-base">🛏️</span>
              <div>
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>Room</p>
                <p className="text-[12px] font-semibold" style={{ color: "#111827" }}>{hotel.room_type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Utensils size={14} style={{ color: "#9ca3af" }} />
              <div>
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>Meals</p>
                <p className="text-[12px] font-semibold" style={{ color: "#111827" }}>{hotel.meal_plan}</p>
              </div>
            </div>
            {place && (
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: "#9ca3af" }} />
                <div>
                  <p className="text-[10px]" style={{ color: "#9ca3af" }}>Check-in by</p>
                  <p className="text-[12px] font-semibold" style={{ color: "#111827" }}>{place.checkin_time}</p>
                </div>
              </div>
            )}
          </div>

          {/* Amenities */}
          {place?.amenities && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: "#9ca3af" }}>Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {place.amenities.map(a => (
                  <span key={a} className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{ background: "#f3f4f6", color: "#374151" }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Nearby */}
          {place?.nearby && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: "#9ca3af" }}>Nearby</p>
              {place.nearby.map(nb => (
                <div key={nb} className="flex items-center gap-2 mb-1">
                  <MapPin size={11} style={{ color: "#9ca3af", flexShrink: 0 }} />
                  <p className="text-[12px]" style={{ color: "#6b7280" }}>{nb}</p>
                </div>
              ))}
            </div>
          )}

          {/* WiFi */}
          {hotel.wifi_password && (
            <div className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid #f3f4f6", background: "#f0f9ff" }}>
              <Wifi size={15} style={{ color: "#0369a1", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold" style={{ color: "#0369a1" }}>{hotel.wifi_name}</p>
                <p className="text-[14px] font-bold font-mono text-[#111827]">{hotel.wifi_password}</p>
              </div>
              <CopyButton text={hotel.wifi_password} />
            </div>
          )}

          {/* Address */}
          {hotel.address && (
            <div className="flex items-start gap-2 px-4 py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <MapPin size={13} style={{ color: "#9ca3af", marginTop: 1, flexShrink: 0 }} />
              <p className="text-[12px] leading-relaxed" style={{ color: "#6b7280" }}>{hotel.address}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 px-4 py-4">
            <a href={`tel:${hotel.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-white tap-active"
              style={{ background: "#16a34a" }}>
              <Phone size={14} /> Call Hotel
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold tap-active"
              style={{ background: "#eff6ff", color: "#2563eb" }}>
              <MapPin size={14} /> Open Maps
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
      <div className="px-5 pt-5 pb-4">
        <h2 className="text-[22px] font-black text-[#111827]">Your Stay</h2>
        <p className="text-[12px] mt-0.5" style={{ color: "#9ca3af" }}>{trip.hotels.length} hotels · {trip.itinerary.length} nights</p>
      </div>

      <div className="px-4 mb-4">
        {trip.hotels.map((h, i) => (
          <HotelCard key={i} hotel={h} isTonight={h === tonightHotel} />
        ))}
      </div>

      <div className="px-4 mb-8">
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3 px-1" style={{ color: "#9ca3af" }}>Emergency contacts</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
          {trip.contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-4 py-4"
              style={{ borderBottom: i < trip.contacts.length - 1 ? "1px solid #f3f4f6" : "none" }}>
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
