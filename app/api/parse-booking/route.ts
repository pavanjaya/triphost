import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a booking data extractor for an Indian travel app. Extract structured data from booking confirmations — flight e-tickets, hotel vouchers, train tickets (IRCTC), bus tickets (redBus, AbhiBus), activity passes, etc.

Return ONLY valid JSON. No explanation, no markdown. Respond with exactly one of these shapes:

For transport (flight/train/bus/boat):
{
  "type": "flight" | "train" | "bus" | "boat",
  "subtype": "onward" | "return" | null,
  "title": "IXU → SXR",
  "from": "IXU Aurangabad",
  "to": "SXR Srinagar",
  "via": "HYD" | null,
  "departure": "08:30",
  "arrival": "15:05",
  "date": "2026-05-17",
  "reference": "B417MY",
  "operator": "IndiGo",
  "flightNumber": "6E 7259" | null,
  "travelClass": "Economy" | null,
  "baggage": { "checkin": "15 kg / person", "cabin": "7 kg / person" } | null,
  "passengers": ["Name 1", "Name 2"],
  "legs": [
    { "number": "6E 7259", "from": "IXU Aurangabad", "fromTerminal": "...", "to": "HYD Hyderabad", "toTerminal": "...", "departure": "08:30", "arrival": "09:55", "layoverMinutes": 140 }
  ] | null
}

For hotel:
{
  "type": "hotel",
  "name": "Hotel Name",
  "location": "City",
  "phone": "+91...",
  "check_in": "2026-05-17",
  "check_out": "2026-05-19",
  "room_type": "Deluxe",
  "meal_plan": "B&B",
  "address": "Full address"
}

For activity/event:
{
  "type": "activity",
  "title": "Gulmarg Gondola Phase 1 & 2",
  "date": "2026-05-19",
  "reference": "GONDOLA-2026",
  "slot": "Afternoon (12:00 PM – 3:30 PM)",
  "operator": "...",
  "passengers": ["Name 1"]
}

For anything else:
{
  "type": "other",
  "title": "...",
  "date": "YYYY-MM-DD",
  "reference": "...",
  "notes": "..."
}

If you cannot extract meaningful booking data, return: { "error": "Could not parse booking" }`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, imageBase64, mimeType } = body as {
      text?: string;
      imageBase64?: string;
      mimeType?: string;
    };

    if (!text && !imageBase64) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    const userContent: Anthropic.MessageParam["content"] = [];

    if (imageBase64 && mimeType) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
          data: imageBase64,
        },
      });
      userContent.push({ type: "text", text: "Extract the booking data from this image." });
    } else if (text) {
      userContent.push({ type: "text", text: `Extract the booking data from this text:\n\n${text}` });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("parse-booking error:", err);
    return NextResponse.json({ error: "Failed to parse booking" }, { status: 500 });
  }
}
