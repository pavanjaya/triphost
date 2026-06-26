export interface TripSummary {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  group_size: number;
  organizer: string;
  status: "upcoming" | "active" | "completed";
  cover_emoji: string;
}

function getStatus(start: string, end: string): TripSummary["status"] {
  const today = new Date().toISOString().split("T")[0];
  if (today < start) return "upcoming";
  if (today > end) return "completed";
  return "active";
}

export const trips: TripSummary[] = [
  {
    id: "kashmir-2026",
    name: "Kashmir & Katra",
    destination: "Srinagar · Gulmarg · Pahalgam · Katra",
    start_date: "2026-05-17",
    end_date: "2026-05-25",
    group_size: 8,
    organizer: "Trip Makers",
    status: getStatus("2026-05-17", "2026-05-25"),
    cover_emoji: "🏔️",
  },
  {
    id: "goa-2026",
    name: "Goa Beach Retreat",
    destination: "North Goa · South Goa · Dudhsagar",
    start_date: "2026-08-10",
    end_date: "2026-08-15",
    group_size: 12,
    organizer: "Trip Makers",
    status: getStatus("2026-08-10", "2026-08-15"),
    cover_emoji: "🌊",
  },
  {
    id: "rajasthan-2025",
    name: "Royal Rajasthan",
    destination: "Jaipur · Jodhpur · Udaipur · Jaisalmer",
    start_date: "2025-12-20",
    end_date: "2025-12-30",
    group_size: 16,
    organizer: "Trip Makers",
    status: getStatus("2025-12-20", "2025-12-30"),
    cover_emoji: "🏰",
  },
];
