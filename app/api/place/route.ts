import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export interface PlaceResult {
  name: string;
  photo_url: string | null;
  rating: number | null;
  review_count: number | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  maps_url: string | null;
  place_id: string | null;
  checkin_time: string | null;
  checkout_time: string | null;
  types: string[];
}

async function searchPlaceId(name: string, location: string): Promise<string | null> {
  const query = `${name} ${location}`;
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
  const data = await res.json();
  return data.candidates?.[0]?.place_id ?? null;
}

async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  const fields = [
    "name", "rating", "user_ratings_total", "formatted_address",
    "formatted_phone_number", "website", "url", "photos", "types",
  ].join(",");
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  const data = await res.json();
  const p = data.result;
  if (!p) return null;

  // Get first photo URL if available
  let photo_url: string | null = null;
  if (p.photos?.[0]?.photo_reference) {
    photo_url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=700&photo_reference=${p.photos[0].photo_reference}&key=${API_KEY}`;
  }

  return {
    name: p.name ?? null,
    photo_url,
    rating: p.rating ?? null,
    review_count: p.user_ratings_total ?? null,
    address: p.formatted_address ?? null,
    phone: p.formatted_phone_number ?? null,
    website: p.website ?? null,
    maps_url: p.url ?? null,
    place_id: placeId,
    checkin_time: null,   // not in Places API — keep operator value
    checkout_time: null,
    types: p.types ?? [],
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const location = searchParams.get("location");

  if (!name || !location) {
    return NextResponse.json({ error: "name and location required" }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY not configured" }, { status: 503 });
  }

  try {
    const placeId = await searchPlaceId(name, location);
    if (!placeId) return NextResponse.json({ error: "Place not found" }, { status: 404 });

    const details = await getPlaceDetails(placeId);
    if (!details) return NextResponse.json({ error: "Details not found" }, { status: 404 });

    return NextResponse.json(details);
  } catch (err) {
    console.error("[place API]", err);
    return NextResponse.json({ error: "Places API error" }, { status: 500 });
  }
}
