import { NextRequest, NextResponse } from "next/server";

// Uses Places API (New) — v1 endpoints
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE = "https://places.googleapis.com/v1";

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
  types: string[];
}

async function searchPlace(query: string): Promise<{ id: string; photoName: string | null } | null> {
  const res = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": "places.id,places.photos",
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  const place = data.places?.[0];
  if (!place) return null;
  return {
    id: place.id,
    photoName: place.photos?.[0]?.name ?? null,
  };
}

async function getPlaceDetails(placeId: string): Promise<Omit<PlaceResult, "photo_url"> | null> {
  const fields = "displayName,rating,userRatingCount,formattedAddress,nationalPhoneNumber,websiteUri,googleMapsUri,types";
  const res = await fetch(`${BASE}/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": fields,
    },
    next: { revalidate: 86400 },
  });
  const p = await res.json();
  if (!p || p.error) return null;

  return {
    name: p.displayName?.text ?? null,
    rating: p.rating ?? null,
    review_count: p.userRatingCount ?? null,
    address: p.formattedAddress ?? null,
    phone: p.nationalPhoneNumber ?? null,
    website: p.websiteUri ?? null,
    maps_url: p.googleMapsUri ?? null,
    place_id: placeId,
    types: p.types ?? [],
  };
}

function getPhotoUrl(photoName: string): string {
  return `${BASE}/${photoName}/media?maxWidthPx=700&key=${API_KEY}`;
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
    const found = await searchPlace(`${name} ${location} India`);
    if (!found) return NextResponse.json({ error: "Place not found" }, { status: 404 });

    const [details] = await Promise.all([getPlaceDetails(found.id)]);
    if (!details) return NextResponse.json({ error: "Details not found" }, { status: 404 });

    const photo_url = found.photoName ? getPhotoUrl(found.photoName) : null;

    return NextResponse.json({ ...details, photo_url });
  } catch (err) {
    console.error("[place API]", err);
    return NextResponse.json({ error: "Places API error" }, { status: 500 });
  }
}
