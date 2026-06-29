// Mock enriched place data — mirrors what Google Places API returns.
// When a Places API key is available, replace getPlaceData() with a real fetch
// to /api/place/[place_id] and this file becomes the offline fallback.

export interface PlaceData {
  photo: string;           // hero photo URL
  rating: number;          // e.g. 4.2
  review_count: number;    // e.g. 1843
  description: string;     // 1–2 line summary
  checkin_time: string;    // e.g. "2:00 PM"
  checkout_time: string;   // e.g. "12:00 PM"
  amenities: string[];     // icon labels
  nearby: string[];        // nearby landmarks
  maps_place_id?: string;  // ready for real Places API
}

const PLACES: Record<string, PlaceData> = {
  "Hotel Asian Park": {
    photo: "https://picsum.photos/id/164/700/400",
    rating: 4.1,
    review_count: 2340,
    description: "A well-regarded property on Residency Road, minutes from Dal Lake and the old city bazaars. Known for warm hospitality and clean, spacious rooms.",
    checkin_time: "12:00 PM",
    checkout_time: "11:00 AM",
    amenities: ["Free WiFi", "Room Service", "24hr Front Desk", "Hot Water", "Parking"],
    nearby: ["Dal Lake (2 km)", "Lal Chowk (1.5 km)", "Hazratbal (4 km)"],
  },
  "Hotel Mama Palace": {
    photo: "https://picsum.photos/id/280/700/400",
    rating: 4.4,
    review_count: 876,
    description: "Perched at 2,650 m in Gulmarg, this property offers stunning meadow views and easy walking access to the Gondola base station.",
    checkin_time: "1:00 PM",
    checkout_time: "11:00 AM",
    amenities: ["Mountain View", "Heater", "Hot Water", "Restaurant", "Parking"],
    nearby: ["Gondola Phase 1 (300 m)", "Golf Course (1 km)", "Ski Slopes (500 m)"],
  },
  "Cheerful Charley Houseboat": {
    photo: "https://picsum.photos/id/15/700/400",
    rating: 4.6,
    review_count: 512,
    description: "A heritage houseboat moored on the calm waters of Nagin Lake — an iconic Kashmiri experience with carved walnut interiors and a private sun deck.",
    checkin_time: "2:00 PM",
    checkout_time: "10:00 AM",
    amenities: ["Lake View", "Sun Deck", "Shikara Pickup", "Hot Water", "Meals Included"],
    nearby: ["Nagin Lake (on lake)", "Nishat Garden (3 km)", "Dal Lake (2 km)"],
  },
  "Hotel Srichan Resort": {
    photo: "https://picsum.photos/id/431/700/400",
    rating: 4.3,
    review_count: 1120,
    description: "Set along the Lidder River in Pahalgam, this resort blends mountain charm with modern comforts. Ideal base for Aru Valley and Betab Valley day trips.",
    checkin_time: "12:00 PM",
    checkout_time: "11:00 AM",
    amenities: ["River View", "Garden", "Restaurant", "Hot Water", "Bonfire"],
    nearby: ["Pahalgam Bazaar (500 m)", "Aru Valley (12 km)", "Betab Valley (16 km)"],
  },
  "Hotel Mahesh Residency": {
    photo: "https://picsum.photos/id/225/700/400",
    rating: 4.0,
    review_count: 934,
    description: "A clean, comfortable property in the heart of Katra, within easy reach of the Vaishno Devi yatra registration counters and helipad.",
    checkin_time: "12:00 PM",
    checkout_time: "11:00 AM",
    amenities: ["Free WiFi", "Parking", "24hr Front Desk", "Hot Water", "Luggage Storage"],
    nearby: ["Yatra Registration (200 m)", "Katra Bus Stand (300 m)", "Helipad (1 km)"],
  },
};

export function getPlaceData(hotelName: string): PlaceData | null {
  return PLACES[hotelName] ?? null;
}

function starsFull(rating: number) {
  return Math.floor(rating);
}
function starsHalf(rating: number) {
  return rating % 1 >= 0.3 ? 1 : 0;
}

export function ratingStars(rating: number): string {
  const full = starsFull(rating);
  const half = starsHalf(rating);
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}
