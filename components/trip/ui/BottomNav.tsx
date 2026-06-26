"use client";

import { Home, CalendarDays, BedDouble, Info, Ticket } from "lucide-react";

export type Tab = "now" | "plan" | "stay" | "info" | "passes";

const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "now",    label: "Now",    Icon: Home },
  { id: "plan",   label: "Plan",   Icon: CalendarDays },
  { id: "stay",   label: "Stay",   Icon: BedDouble },
  { id: "info",   label: "Info",   Icon: Info },
  { id: "passes", label: "Passes", Icon: Ticket },
];

export default function BottomNav({ active, onChange }: {
  active: Tab; onChange: (tab: Tab) => void;
}) {
  return (
    <nav className="flex bg-white" style={{
      borderTop: "1px solid rgba(0,0,0,0.06)",
      paddingBottom: "env(safe-area-inset-bottom, 8px)",
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center pt-3 pb-1.5 gap-1 tap-active">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: isActive ? "#eff6ff" : "transparent" }}>
              <Icon size={isActive ? 18 : 20}
                style={{ color: isActive ? "#2563eb" : "#9ca3af" }}
                strokeWidth={isActive ? 2.2 : 1.7} />
            </div>
            <span className="text-[10px] font-semibold"
              style={{ color: isActive ? "#2563eb" : "#9ca3af" }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
