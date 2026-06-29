// Place enrichment layer.
// - getPlaceData()      → sync, returns mock data instantly (used for SSR/fallback)
// - fetchLivePlace()    → async, calls /api/place → Google Places API
//   Falls back to mock if API key not set or request fails.
//
// To go live: add GOOGLE_PLACES_API_KEY to .env.local and Vercel env vars.
// StayScreen calls fetchLivePlace() on mount; until it resolves, mock data shows.

export interface PlaceData {
  photo: string | null;
  rating: number;
  review_count: number;
  description: string;
  checkin_time: string;
  checkout_time: string;
  amenities: string[];
  nearby: string[];
  place_id?: string;
  maps_url?: string;
}

// ── Mock data (shown instantly, overridden by live fetch when API key present) ──

const MOCK: Record<string, PlaceData> = {
  "Hotel Asian Park": {
    photo: "https://picsum.photos/id/164/700/400",
    rating: 4.1, review_count: 2340,
    description: "A well-regarded property on Residency Road, minutes from Dal Lake and the old city bazaars. Known for warm hospitality and clean, spacious rooms.",
    checkin_time: "12:00 PM", checkout_time: "11:00 AM",
    amenities: ["Free WiFi", "Room Service", "24hr Front Desk", "Hot Water", "Parking"],
    nearby: ["Dal Lake (2 km)", "Lal Chowk (1.5 km)", "Hazratbal (4 km)"],
  },
  "Hotel Mama Palace": {
    photo: "https://picsum.photos/id/280/700/400",
    rating: 4.4, review_count: 876,
    description: "Perched at 2,650 m in Gulmarg, this property offers stunning meadow views and easy walking access to the Gondola base station.",
    checkin_time: "1:00 PM", checkout_time: "11:00 AM",
    amenities: ["Mountain View", "Heater", "Hot Water", "Restaurant", "Parking"],
    nearby: ["Gondola Phase 1 (300 m)", "Golf Course (1 km)", "Ski Slopes (500 m)"],
  },
  "Cheerful Charley Houseboat": {
    photo: "https://picsum.photos/id/15/700/400",
    rating: 4.6, review_count: 512,
    description: "A heritage houseboat moored on the calm waters of Nagin Lake — an iconic Kashmiri experience with carved walnut interiors and a private sun deck.",
    checkin_time: "2:00 PM", checkout_time: "10:00 AM",
    amenities: ["Lake View", "Sun Deck", "Shikara Pickup", "Hot Water", "Meals Included"],
    nearby: ["Nagin Lake (on lake)", "Nishat Garden (3 km)", "Dal Lake (2 km)"],
  },
  "Hotel Srichan Resort": {
    photo: "https://picsum.photos/id/431/700/400",
    rating: 4.3, review_count: 1120,
    description: "Set along the Lidder River in Pahalgam, this resort blends mountain charm with modern comforts. Ideal base for Aru Valley and Betab Valley day trips.",
    checkin_time: "12:00 PM", checkout_time: "11:00 AM",
    amenities: ["River View", "Garden", "Restaurant", "Hot Water", "Bonfire"],
    nearby: ["Pahalgam Bazaar (500 m)", "Aru Valley (12 km)", "Betab Valley (16 km)"],
  },
  "Hotel Mahesh Residency": {
    photo: "https://picsum.photos/id/225/700/400",
    rating: 4.0, review_count: 934,
    description: "A clean, comfortable property in the heart of Katra, within easy reach of the Vaishno Devi yatra registration counters and helipad.",
    checkin_time: "12:00 PM", checkout_time: "11:00 AM",
    amenities: ["Free WiFi", "Parking", "24hr Front Desk", "Hot Water", "Luggage Storage"],
    nearby: ["Yatra Registration (200 m)", "Katra Bus Stand (300 m)", "Helipad (1 km)"],
  },
};

/** Instant sync lookup — always returns mock data. Use as initial state. */
export function getPlaceData(hotelName: string): PlaceData | null {
  return MOCK[hotelName] ?? null;
}

/** Async fetch — tries Google Places API, falls back to mock on any failure. */
export async function fetchLivePlace(hotelName: string, location: string): Promise<PlaceData> {
  const mock = MOCK[hotelName] ?? null;

  try {
    const res = await fetch(`/api/place?name=${encodeURIComponent(hotelName)}&location=${encodeURIComponent(location)}`);
    if (!res.ok) return mock ?? fallback(hotelName);
    const live = await res.json();

    // Merge live data over mock — keep mock amenities/nearby/description if Places doesn't have them
    return {
      photo: live.photo_url ?? mock?.photo ?? null,
      rating: live.rating ?? mock?.rating ?? 0,
      review_count: live.review_count ?? mock?.review_count ?? 0,
      description: mock?.description ?? "",          // Places API doesn't return descriptions
      checkin_time: mock?.checkin_time ?? "12:00 PM",
      checkout_time: mock?.checkout_time ?? "11:00 AM",
      amenities: mock?.amenities ?? [],
      nearby: mock?.nearby ?? [],
      place_id: live.place_id,
      maps_url: live.maps_url,
    };
  } catch {
    return mock ?? fallback(hotelName);
  }
}

function fallback(name: string): PlaceData {
  return {
    photo: null, rating: 0, review_count: 0,
    description: name, checkin_time: "12:00 PM", checkout_time: "11:00 AM",
    amenities: [], nearby: [],
  };
}
