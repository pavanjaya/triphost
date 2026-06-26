export type PersonalDocType = "aadhaar" | "pan" | "passport" | "driving_licence" | "other";

export interface PersonalDocument {
  id: string;
  type: PersonalDocType;
  label: string;          // e.g. "Aadhaar Card"
  fileBase64: string;     // data URL
  mimeType: string;       // image/jpeg, image/png, application/pdf
  uploadedAt: string;     // ISO date
}

const KEY = "howztrip_personal_docs";

export function getPersonalDocs(): PersonalDocument[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); }
  catch { return []; }
}

export function savePersonalDoc(doc: PersonalDocument): void {
  const docs = getPersonalDocs().filter(d => d.id !== doc.id);
  localStorage.setItem(KEY, JSON.stringify([...docs, doc]));
}

export function deletePersonalDoc(id: string): void {
  const docs = getPersonalDocs().filter(d => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(docs));
}

export const DOC_META: Record<PersonalDocType, { label: string; emoji: string; hint: string }> = {
  aadhaar:         { label: "Aadhaar Card",      emoji: "🪪", hint: "Front & back as one image or PDF" },
  pan:             { label: "PAN Card",           emoji: "🗂️", hint: "PAN card scan or PDF" },
  passport:        { label: "Passport",           emoji: "📘", hint: "First page with photo" },
  driving_licence: { label: "Driving Licence",   emoji: "🚗", hint: "Front side" },
  other:           { label: "Other Document",    emoji: "📄", hint: "Any other ID or document" },
};
