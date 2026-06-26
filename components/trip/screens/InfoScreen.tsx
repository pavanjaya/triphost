"use client";

import { CheckCircle2, XCircle, AlertCircle, Phone, Globe } from "lucide-react";
import { Trip } from "@/lib/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-4 mb-4">
      <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-2" style={{ color: "#9ca3af" }}>{title}</p>
      <div className="rounded-3xl overflow-hidden" style={{ background: "#fff" }}>
        {children}
      </div>
    </div>
  );
}

function Item({ icon, text, last }: { icon: React.ReactNode; text: string; last?: boolean }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5"
      style={{ borderBottom: last ? "none" : "1px solid #f7f7f5" }}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <p className="text-[13px] leading-snug" style={{ color: "#374151" }}>{text}</p>
    </div>
  );
}

export default function InfoScreen({ trip }: { trip: Trip }) {
  const op = trip.operator;

  return (
    <div className="scroll-hide overflow-y-auto h-full pb-6" style={{ background: "#f7f7f5" }}>
      <div className="px-4 pt-5 pb-4">
        <h2 className="text-[22px] font-black" style={{ color: "#111827" }}>Trip Info</h2>
        <p className="text-[13px] mt-1" style={{ color: "#9ca3af" }}>{"What's covered, what's not, and key reminders"}</p>
      </div>

      {/* Inclusions */}
      {trip.inclusions && trip.inclusions.length > 0 && (
        <Section title="Inclusions">
          {trip.inclusions.map((item, i) => (
            <Item key={i} last={i === trip.inclusions!.length - 1}
              icon={<CheckCircle2 size={16} style={{ color: "#16a34a" }} />}
              text={item} />
          ))}
        </Section>
      )}

      {/* Exclusions */}
      {trip.exclusions && trip.exclusions.length > 0 && (
        <Section title="Exclusions — Not Covered">
          {trip.exclusions.map((item, i) => (
            <Item key={i} last={i === trip.exclusions!.length - 1}
              icon={<XCircle size={16} style={{ color: "#e11d48" }} />}
              text={item} />
          ))}
        </Section>
      )}

      {/* Notes */}
      {trip.notes && trip.notes.length > 0 && (
        <Section title="Important Notes">
          {trip.notes.map((item, i) => (
            <Item key={i} last={i === trip.notes!.length - 1}
              icon={<AlertCircle size={16} style={{ color: "#f59e0b" }} />}
              text={item} />
          ))}
        </Section>
      )}

      {/* Operator contact */}
      {op && (
        <Section title="Organised by">
          <div className="flex items-center gap-3 px-4 py-4"
            style={{ borderBottom: "1px solid #f7f7f5" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[20px] shrink-0"
              style={{ background: "#f7f7f5" }}>
              {op.logo ?? "🏢"}
            </div>
            <div>
              <p className="text-[14px] font-bold" style={{ color: op.color }}>{op.name}</p>
              {op.tagline && <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{op.tagline}</p>}
            </div>
          </div>
          {op.phone && (
            <a href={`tel:${op.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 px-4 py-3.5 tap-active"
              style={{ borderBottom: op.website ? "1px solid #f7f7f5" : "none" }}>
              <Phone size={15} style={{ color: "#6b7280" }} />
              <span className="text-[13px]" style={{ color: "#374151" }}>{op.phone}</span>
            </a>
          )}
          {op.website && (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Globe size={15} style={{ color: "#6b7280" }} />
              <span className="text-[13px]" style={{ color: "#374151" }}>{op.website}</span>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
