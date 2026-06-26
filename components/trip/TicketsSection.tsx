"use client";

import { Ticket as TicketIcon, Clock, User } from "lucide-react";
import { Ticket } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function TicketsSection({ tickets }: { tickets: Ticket[] }) {
  return (
    <section className="mx-4">
      <div className="flex items-center gap-2 mb-2">
        <TicketIcon size={14} className="text-gray-400" />
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Activity Tickets</h2>
      </div>
      <div className="flex flex-col gap-3">
        {tickets.map((ticket, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-[#1a2744] px-4 py-3">
              <p className="font-semibold text-white text-sm">{ticket.activity}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-blue-200 text-xs">
                  <Clock size={11} />
                  {ticket.slot}
                </span>
              </div>
              <p className="text-blue-300 text-xs mt-0.5">{formatDate(ticket.date)}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Passengers & Ticket Numbers</p>
              <div className="divide-y divide-gray-50">
                {ticket.passengers.map((p, j) => (
                  <div key={j} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-gray-300" />
                      <span className="text-sm text-gray-700">{p.name}</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      #{p.ticket}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
