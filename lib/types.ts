export interface Driver {
  name: string;
  phone: string;
  vehicle_number: string;
  vehicle_type: string;
}

export interface Hotel {
  name: string;
  location: string;
  phone: string;
  check_in: string;
  check_out: string;
  room_type: string;
  meal_plan: string;
  address?: string;
  wifi_name?: string;
  wifi_password?: string;
}

export interface FlightLeg {
  number: string;
  from: string;
  fromTerminal?: string;
  to: string;
  toTerminal?: string;
  departure: string;
  arrival: string;
  layoverMinutes?: number;
}

export type PassType = "flight" | "bus" | "train" | "boat" | "activity" | "hotel_voucher" | "other";

export interface Pass {
  id: string;
  type: PassType;
  subtype?: "onward" | "return";   // for flights / bus / train
  title: string;                    // e.g. "IXU → SXR" or "Gulmarg Gondola"
  from?: string;                    // city / station
  to?: string;
  via?: string;
  departure?: string;               // HH:MM
  arrival?: string;
  date: string;                     // YYYY-MM-DD
  reference: string;                // PNR / booking ID / ticket number
  operator?: string;                // airline, bus company, etc.
  slot?: string;                    // activity time slot
  passengers?: string[];
  notes?: string;
  pdfUrl?: string;
  // flight-specific extras
  flightNumber?: string;
  travelClass?: string;
  baggage?: { checkin: string; cabin: string };
  legs?: FlightLeg[];
  // activity-specific
  activityPassengers?: { name: string; ticket: string }[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  description: string;
}

export interface Contact {
  name: string;
  role: string;
  phone: string;
}

export interface Operator {
  name: string;
  tagline?: string;
  logo?: string;       // URL or emoji fallback
  color: string;       // brand hex color
  phone?: string;
  website?: string;
}

export interface TripDocument {
  id: string;
  name: string;
  type: "insurance" | "permit" | "itinerary" | "hotel_voucher" | "other";
  emoji?: string;
  url?: string;          // external link
  fileBase64?: string;   // uploaded PDF/image
  mimeType?: string;
}

export interface Trip {
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  group_size: number;
  organizer: string;
  operator?: Operator;
  driver: Driver;
  hotels: Hotel[];
  passes: Pass[];
  itinerary: ItineraryDay[];
  contacts: Contact[];
  inclusions?: string[];
  exclusions?: string[];
  notes?: string[];
  documents?: TripDocument[];
}
