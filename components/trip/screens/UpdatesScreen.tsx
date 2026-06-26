"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { notifications } from "@/lib/notifications";

const dotStyle: Record<string, string> = {
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#2563eb",
  neutral: "#d1d5db",
};

export default function UpdatesScreen({ unreadCount: _unreadCount }: { unreadCount: number }) {
  const [notifs, setNotifs] = useState(notifications);

  return (
    <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
      <div className="px-5 pt-12 pb-5 flex items-end justify-between">
        <div>
          <p className="text-[12px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>From Trip Makers</p>
          <h2 className="text-[26px] font-bold text-[#111827]">Updates</h2>
        </div>
        {notifs.some((n) => !n.read) && (
          <button onClick={() => setNotifs((n) => n.map((i) => ({ ...i, read: true })))}
            className="text-[12px] font-bold px-4 py-2 rounded-full tap-active"
            style={{ background: "#eff6ff", color: "#2563eb" }}>
            Mark read
          </button>
        )}
      </div>

      <div className="px-4 pb-8 flex flex-col gap-3">
        {/* Push notification banner */}
        <div className="rounded-3xl px-5 py-4 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", boxShadow: "0 2px 12px rgba(37,99,235,0.10)" }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#2563eb" }}>
            <BellRing size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#111827]">Stay in the loop</p>
            <p className="text-[11px]" style={{ color: "#6b7280" }}>Enable push notifications</p>
          </div>
          <button onClick={() => { if ("Notification" in window) Notification.requestPermission(); }}
            className="text-[12px] font-bold text-white px-4 py-2 rounded-full shrink-0 tap-active"
            style={{ background: "#2563eb" }}>
            Enable
          </button>
        </div>

        {notifs.map((notif) => (
          <div key={notif.id} className="rounded-3xl px-5 py-4"
            style={{
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              opacity: notif.read ? 0.65 : 1,
            }}>
            <div className="flex gap-3">
              <div className="mt-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotStyle[notif.type] }} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#111827] leading-snug">{notif.title}</p>
                <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: "#6b7280" }}>{notif.body}</p>
                <p className="text-[11px] mt-2 font-medium" style={{ color: "#d1d5db" }}>{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
