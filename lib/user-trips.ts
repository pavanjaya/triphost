import { Pass, Hotel } from "./types";

export interface UserTrip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  passes: Pass[];
  hotels: Hotel[];
  created_at: string;
  share_token: string;
}

const KEY = "howstrip_user_trips";

export function getUserTrips(): UserTrip[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveUserTrip(trip: UserTrip): void {
  const trips = getUserTrips().filter(t => t.id !== trip.id);
  localStorage.setItem(KEY, JSON.stringify([trip, ...trips]));
}

export function getUserTrip(id: string): UserTrip | null {
  return getUserTrips().find(t => t.id === id) ?? null;
}

export function deleteUserTrip(id: string): void {
  const trips = getUserTrips().filter(t => t.id !== id);
  localStorage.setItem(KEY, JSON.stringify(trips));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function generateShareToken(): string {
  return Math.random().toString(36).slice(2, 14);
}
