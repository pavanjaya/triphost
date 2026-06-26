export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "info" | "warning" | "success" | "neutral";
  read: boolean;
}

export const notifications: AppNotification[] = [
  {
    id: "1",
    title: "🚡 Gondola tickets confirmed",
    body: "Your afternoon slot (12:00–3:30 PM) is locked in. Please assemble at the gondola base by 11:45 AM sharp.",
    time: "Today · 7:30 AM",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "🚌 Bus departs at 8:00 AM tomorrow",
    body: "We leave for Pahalgam after breakfast. Please keep luggage ready in the hotel lobby by 7:45 AM.",
    time: "Yesterday · 9:15 PM",
    type: "warning",
    read: false,
  },
  {
    id: "3",
    title: "🏨 Hotel check-in today",
    body: "Hotel Mama Palace, Gulmarg. Rooms ready from 2:00 PM. Complimentary breakfast included.",
    time: "Today · 6:00 AM",
    type: "info",
    read: true,
  },
  {
    id: "4",
    title: "📍 Pro tip: Dress warm in Gulmarg",
    body: "Temperature in Gulmarg can drop below 5°C even in May. Carry a jacket for the gondola ride.",
    time: "Yesterday · 8:00 AM",
    type: "info",
    read: true,
  },
  {
    id: "5",
    title: "✅ Welcome to TripHost!",
    body: "Your Kashmir & Katra trip is all set. All tickets, hotels and contacts are saved here. Have a wonderful journey!",
    time: "17 May · 8:00 AM",
    type: "neutral",
    read: true,
  },
];
