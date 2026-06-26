"use client";

import { Home, CalendarDays, Ticket, Bell, Info } from "lucide-react";

export type Tab = "home" | "plan" | "tickets" | "updates" | "info";

const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "plan", label: "Plan", Icon: CalendarDays },
  { id: "tickets", label: "Tickets", Icon: Ticket },
  { id: "updates", label: "Updates", Icon: Bell },
  { id: "info", label: "Info", Icon: Info },
];

export default function BottomNav({ active, onChange, unread }: {
  active: Tab; onChange: (tab: Tab) => void; unread?: number;
}) {
  return (
    <nav className="flex bg-white" style={{
      borderTop: "1px solid rgba(0,0,0,0.06)",
      paddingBottom: "env(safe-area-inset-bottom, 8px)",
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        const hasUnread = id === "updates" && unread && unread > 0;
        return (
          <button key={id} onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center pt-3 pb-1.5 gap-1 relative tap-active">
            <div className="relative">
              {isActive ? (
                <div className="w-9 h-9 rounded-2xl bg-[#eff6ff] flex items-center justify-center">
                  <Icon size={18} className="text-primary" strokeWidth={2.2} />
                </div>
              ) : (
                <div className="w-9 h-9 flex items-center justify-center">
                  <Icon size={20} className="text-[#9ca3af]" strokeWidth={1.7} />
                </div>
              )}
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {unread}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-[#9ca3af]"}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
