export interface Place {
  name: string;
  type: "nature" | "heritage" | "religious" | "activity" | "market" | "viewpoint";
  emoji: string;
  tip?: string;
  image?: string;
}

const p = (seed: string) => `https://picsum.photos/seed/${seed}/120/120`;

const PLACES: Record<string, Place[]> = {
  "Srinagar": [
    { name: "Nishat Bagh", type: "nature", emoji: "🌸", tip: "Best in morning light", image: p("nishat-bagh") },
    { name: "Shalimar Bagh", type: "heritage", emoji: "🏛️", tip: "Mughal-era terraced garden", image: p("shalimar-garden") },
    { name: "Shankaracharya Temple", type: "religious", emoji: "🛕", tip: "Panoramic view of the city", image: p("shankaracharya-hill") },
    { name: "Hazratbal Shrine", type: "religious", emoji: "🕌", image: p("hazratbal-shrine") },
    { name: "Dal Lake Shikara", type: "activity", emoji: "🚣", tip: "1-hr ride, negotiate before boarding", image: p("dal-lake-shikara") },
    { name: "Lal Chowk", type: "market", emoji: "🛍️", tip: "Pashmina shawls & saffron", image: p("lal-chowk-market") },
  ],
  "Dal Lake, Srinagar": [
    { name: "Shikara ride at sunrise", type: "activity", emoji: "🌅", tip: "Most scenic before 8 AM", image: p("shikara-sunrise") },
    { name: "Floating vegetable market", type: "market", emoji: "🛶", tip: "Starts at 6 AM", image: p("floating-market") },
    { name: "Nagin Lake walk", type: "nature", emoji: "🌿", image: p("nagin-lake") },
    { name: "Nehru Park (lake island)", type: "nature", emoji: "🏝️", image: p("nehru-park-island") },
  ],
  "Gulmarg": [
    { name: "Gulmarg Gondola Phase 1", type: "activity", emoji: "🚡", tip: "Kongdori station at 8,530 ft", image: p("gulmarg-gondola") },
    { name: "Gulmarg Gondola Phase 2", type: "activity", emoji: "🏔️", tip: "Apharwat Peak at 13,780 ft — very cold, carry jacket", image: p("apharwat-peak") },
    { name: "Strawberry Valley", type: "nature", emoji: "🍓", tip: "Short walk from gondola base", image: p("strawberry-valley-gulmarg") },
    { name: "Bota Pathri meadow", type: "nature", emoji: "🌾", tip: "15 min drive from Gulmarg, less crowded", image: p("bota-pathri") },
    { name: "St. Mary's Church (1942)", type: "heritage", emoji: "⛪", image: p("stmarys-church-gulmarg") },
    { name: "Golf Course walk", type: "nature", emoji: "⛳", tip: "One of Asia's highest golf courses", image: p("gulmarg-golf") },
  ],
  "Pahalgam": [
    { name: "Baisaran (Mini Switzerland)", type: "viewpoint", emoji: "🏔️", tip: "Horse ride or 30-min trek, own cost", image: p("baisaran-meadow") },
    { name: "Betab Valley", type: "nature", emoji: "🌲", tip: "Named after 1983 Bollywood film", image: p("betab-valley") },
    { name: "Aru Valley", type: "nature", emoji: "🏕️", tip: "15 km from Pahalgam, serene & less touristy", image: p("aru-valley-kashmir") },
    { name: "Chandanwadi", type: "nature", emoji: "❄️", tip: "Start point of Amarnath Yatra", image: p("chandanwadi-snow") },
    { name: "Lidder River walk", type: "nature", emoji: "💧", image: p("lidder-river") },
    { name: "Apple orchards", type: "nature", emoji: "🍎", tip: "Along the Aru road", image: p("apple-orchard-kashmir") },
  ],
  "Katra": [
    { name: "Vaishno Devi Temple", type: "religious", emoji: "🛕", tip: "14 km trek from Katra base — start early to avoid crowd", image: p("vaishno-devi") },
    { name: "Banganga (first stop)", type: "religious", emoji: "💧", tip: "Holy river on Vaishno Devi route", image: p("banganga-katra") },
    { name: "Ardhkuwari Cave", type: "religious", emoji: "🪔", tip: "Midway point, very sacred", image: p("ardhkuwari-cave") },
    { name: "Katra market", type: "market", emoji: "🛍️", tip: "Dried fruits & local handicrafts", image: p("katra-bazaar") },
  ],
  "Sonmarg": [
    { name: "Thajwas Glacier", type: "nature", emoji: "❄️", tip: "Accessible by horse or 3 km trek", image: p("thajwas-glacier") },
    { name: "Zoji La Zero Point", type: "viewpoint", emoji: "🏔️", tip: "80 km from Srinagar, ~2 hrs each way — dress very warm", image: p("zoji-la-pass") },
    { name: "Sindh River", type: "nature", emoji: "🎣", tip: "Trout fishing spot", image: p("sindh-river-sonmarg") },
  ],
};

export function getPlacesForLocation(location: string): Place[] {
  if (PLACES[location]) return PLACES[location];
  const key = Object.keys(PLACES).find(k => location.includes(k) || k.includes(location.split(",")[0].trim()));
  return key ? PLACES[key] : [];
}
