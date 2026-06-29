export interface Place {
  name: string;
  type: "nature" | "heritage" | "religious" | "activity" | "market" | "viewpoint";
  emoji: string;
  tip?: string;
}

const PLACES: Record<string, Place[]> = {
  "Srinagar": [
    { name: "Nishat Bagh", type: "nature", emoji: "🌸", tip: "Best in morning light" },
    { name: "Shalimar Bagh", type: "heritage", emoji: "🏛️", tip: "Mughal-era terraced garden" },
    { name: "Shankaracharya Temple", type: "religious", emoji: "🛕", tip: "Panoramic view of the city" },
    { name: "Hazratbal Shrine", type: "religious", emoji: "🕌" },
    { name: "Dal Lake Shikara", type: "activity", emoji: "🚣", tip: "1-hr ride, negotiate before boarding" },
    { name: "Lal Chowk", type: "market", emoji: "🛍️", tip: "Pashmina shawls & saffron" },
  ],
  "Dal Lake, Srinagar": [
    { name: "Shikara ride at sunrise", type: "activity", emoji: "🌅", tip: "Most scenic before 8 AM" },
    { name: "Floating vegetable market", type: "market", emoji: "🛶", tip: "Starts at 6 AM" },
    { name: "Nagin Lake walk", type: "nature", emoji: "🌿" },
    { name: "Nehru Park (lake island)", type: "nature", emoji: "🏝️" },
  ],
  "Gulmarg": [
    { name: "Gulmarg Gondola Phase 1", type: "activity", emoji: "🚡", tip: "Kongdori station at 8,530 ft" },
    { name: "Gulmarg Gondola Phase 2", type: "activity", emoji: "🏔️", tip: "Apharwat Peak at 13,780 ft — very cold, carry jacket" },
    { name: "Strawberry Valley", type: "nature", emoji: "🍓", tip: "Short walk from gondola base" },
    { name: "Bota Pathri meadow", type: "nature", emoji: "🌾", tip: "15 min drive from Gulmarg, less crowded" },
    { name: "St. Mary's Church Gulmarg", type: "heritage", emoji: "⛪" },
    { name: "Gulmarg Golf Course", type: "nature", emoji: "⛳", tip: "One of Asia's highest golf courses" },
  ],
  "Pahalgam": [
    { name: "Baisaran meadow Pahalgam", type: "viewpoint", emoji: "🏔️", tip: "Horse ride or 30-min trek, own cost" },
    { name: "Betab Valley", type: "nature", emoji: "🌲", tip: "Named after 1983 Bollywood film" },
    { name: "Aru Valley Kashmir", type: "nature", emoji: "🏕️", tip: "15 km from Pahalgam, serene & less touristy" },
    { name: "Chandanwari Kashmir", type: "nature", emoji: "❄️", tip: "Start point of Amarnath Yatra" },
    { name: "Lidder River Pahalgam", type: "nature", emoji: "💧" },
    { name: "Apple orchards Pahalgam", type: "nature", emoji: "🍎", tip: "Along the Aru road" },
  ],
  "Katra": [
    { name: "Vaishno Devi Shrine", type: "religious", emoji: "🛕", tip: "14 km trek from Katra base — start early to avoid crowd" },
    { name: "Banganga Katra", type: "religious", emoji: "💧", tip: "Holy river on Vaishno Devi route" },
    { name: "Ardhkuwari Cave Katra", type: "religious", emoji: "🪔", tip: "Midway point, very sacred" },
    { name: "Katra market Jammu", type: "market", emoji: "🛍️", tip: "Dried fruits & local handicrafts" },
  ],
  "Sonmarg": [
    { name: "Thajiwas Glacier Sonmarg", type: "nature", emoji: "❄️", tip: "Accessible by horse or 3 km trek" },
    { name: "Zoji La pass Kashmir", type: "viewpoint", emoji: "🏔️", tip: "80 km from Srinagar, ~2 hrs each way — dress very warm" },
    { name: "Sindh River Sonmarg", type: "nature", emoji: "🎣", tip: "Trout fishing spot" },
  ],
};

export function getPlacesForLocation(location: string): Place[] {
  if (PLACES[location]) return PLACES[location];
  const key = Object.keys(PLACES).find(k => location.includes(k) || k.includes(location.split(",")[0].trim()));
  return key ? PLACES[key] : [];
}
