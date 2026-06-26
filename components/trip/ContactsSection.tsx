"use client";

import { PhoneCall, ShieldAlert } from "lucide-react";
import { Contact } from "@/lib/types";

export default function ContactsSection({ contacts }: { contacts: Contact[] }) {
  return (
    <section className="mx-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert size={14} className="text-gray-400" />
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Emergency Contacts</h2>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {contacts.map((contact, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="font-medium text-gray-900 text-sm">{contact.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{contact.role}</p>
            </div>
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-full transition-colors"
            >
              <PhoneCall size={12} />
              {contact.phone.replace("+91", "+91 ")}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
