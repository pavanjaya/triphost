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
}

export interface FlightLeg {
  number: string;
  from: string;
  fromTerminal?: string;
  to: string;
  toTerminal?: string;
  departure: string;
  arrival: string;
  layoverMinutes?: number; // layover AFTER this leg before the next
}

export interface Flight {
  type: "onward" | "return";
  number: string;
  pnr: string;
  bookingRef?: string;
  airline?: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  date: string;
  via: string;
  pdfUrl?: string;
  legs?: FlightLeg[];
  passengers?: string[];
  baggage?: { checkin: string; cabin: string };
  travelClass?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  description: string;
}

export interface Passenger {
  name: string;
  ticket: string;
}

export interface Ticket {
  activity: string;
  date: string;
  slot: string;
  passengers: Passenger[];
}

export interface Contact {
  name: string;
  role: string;
  phone: string;
}

export interface Trip {
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  group_size: number;
  organizer: string;
  driver: Driver;
  hotels: Hotel[];
  flights: Flight[];
  itinerary: ItineraryDay[];
  contacts: Contact[];
  tickets: Ticket[];
}
