export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  date: string; // YYYY-MM-DD — which trip day this belongs to
  type: "info" | "warning" | "success" | "neutral";
  read: boolean;
}

export const notifications: AppNotification[] = [
  {
    id: "1",
    title: "🚡 Gondola slot confirmed",
    body: "Your afternoon slot (12:00–3:30 PM) is locked in. Please assemble at the gondola base by 11:45 AM sharp.",
    time: "7:30 AM",
    date: "2026-05-19",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "🚌 Bus departs at 8:00 AM tomorrow",
    body: "We leave for Pahalgam after breakfast. Please keep luggage ready in the hotel lobby by 7:45 AM.",
    time: "9:15 PM",
    date: "2026-05-20",
    type: "warning",
    read: false,
  },
  {
    id: "3",
    title: "🏨 Check-in from 2:00 PM",
    body: "Hotel Mama Palace, Gulmarg. Rooms will be ready from 2 PM. Complimentary breakfast included tomorrow.",
    time: "6:00 AM",
    date: "2026-05-19",
    type: "info",
    read: true,
  },
  {
    id: "4",
    title: "🧥 Dress warm in Gulmarg",
    body: "Temperature can drop below 5°C even in May. Carry a jacket for the gondola ride.",
    time: "8:00 AM",
    date: "2026-05-19",
    type: "info",
    read: true,
  },
  {
    id: "5",
    title: "🌸 Explore the Mughal Gardens today",
    body: "Nishat Bagh and Shalimar Bagh are stunning in May. Best visited before noon to avoid crowds.",
    time: "8:00 AM",
    date: "2026-05-18",
    type: "info",
    read: true,
  },
  {
    id: "6",
    title: "✅ Welcome to your Kashmir trip!",
    body: "All tickets, hotels and contacts are saved here. Have a wonderful journey!",
    time: "8:00 AM",
    date: "2026-05-17",
    type: "neutral",
    read: true,
  },
];
