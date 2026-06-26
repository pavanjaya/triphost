"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, X, FileText, Eye } from "lucide-react";
import {
  PersonalDocument, PersonalDocType,
  getPersonalDocs, savePersonalDoc, deletePersonalDoc, DOC_META,
} from "@/lib/user-documents";

function generateId() { return Math.random().toString(36).slice(2, 10); }

const DOC_TYPES: PersonalDocType[] = ["aadhaar", "pan", "passport", "driving_licence", "other"];

function DocViewer({ doc, onClose }: { doc: PersonalDocument; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: "#000" }}>
      <div className="flex items-center justify-between px-4 pt-12 pb-3" style={{ background: "#111" }}>
        <div>
          <p className="text-white font-bold text-[15px]">{DOC_META[doc.type].emoji} {doc.label}</p>
          <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>
            {new Date(doc.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#333" }}>
          <X size={16} color="white" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-auto p-4">
        {doc.mimeType === "application/pdf" ? (
          <iframe src={doc.fileBase64} className="w-full h-full rounded-xl" style={{ minHeight: 400 }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={doc.fileBase64} alt={doc.label} className="max-w-full max-h-full rounded-xl object-contain" />
        )}
      </div>
    </div>
  );
}

function UploadSheet({ onClose, onSave }: { onClose: () => void; onSave: (doc: PersonalDocument) => void }) {
  const [type, setType] = useState<PersonalDocType>("aadhaar");
  const [file, setFile] = useState<{ base64: string; mime: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    const reader = new FileReader();
    reader.onload = e => {
      setFile({ base64: e.target?.result as string, mime: f.type, name: f.name });
    };
    reader.readAsDataURL(f);
  }

  function handleSave() {
    if (!file) return;
    setLoading(true);
    const doc: PersonalDocument = {
      id: generateId(),
      type,
      label: DOC_META[type].label,
      fileBase64: file.base64,
      mimeType: file.mime,
      uploadedAt: new Date().toISOString(),
    };
    savePersonalDoc(doc);
    onSave(doc);
    setLoading(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-[55]" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-[56] w-full rounded-t-[28px] pb-10 px-5 pt-5"
        style={{ maxWidth: 430, transform: "translateX(-50%)", background: "#fff" }}>
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full" style={{ background: "#e5e7eb" }} />
        </div>
        <p className="text-[18px] font-black text-[#111827] mb-4">Add Document</p>

        {/* Type selector */}
        <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9ca3af" }}>Document type</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {DOC_TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className="flex items-center gap-2 px-3 py-3 rounded-2xl text-left tap-active"
              style={{
                background: type === t ? "#eff6ff" : "#f7f7f5",
                border: type === t ? "1.5px solid #2563eb" : "1.5px solid transparent",
              }}>
              <span className="text-[20px]">{DOC_META[t].emoji}</span>
              <span className="text-[12px] font-semibold" style={{ color: type === t ? "#2563eb" : "#374151" }}>
                {DOC_META[t].label}
              </span>
            </button>
          ))}
        </div>

        {/* File picker */}
        <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

        {file ? (
          <div className="rounded-2xl px-4 py-3 mb-5 flex items-center gap-3"
            style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
            <FileText size={20} style={{ color: "#16a34a" }} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#111827] truncate">{file.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#16a34a" }}>Ready to save</p>
            </div>
            <button onClick={() => setFile(null)}>
              <X size={15} style={{ color: "#6b7280" }} />
            </button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl py-5 flex flex-col items-center gap-2 mb-5 tap-active"
            style={{ background: "#f7f7f5", border: "1.5px dashed #d1d5db" }}>
            <span className="text-[28px]">📎</span>
            <p className="text-[13px] font-semibold" style={{ color: "#374151" }}>Tap to upload</p>
            <p className="text-[11px]" style={{ color: "#9ca3af" }}>{DOC_META[type].hint}</p>
          </button>
        )}

        <button onClick={handleSave} disabled={!file || loading}
          className="w-full py-4 rounded-2xl font-bold text-[15px] text-white tap-active"
          style={{ background: file ? "#2563eb" : "#d1d5db" }}>
          {loading ? "Saving…" : "Save Document"}
        </button>
      </div>
    </>
  );
}

export default function MyDocuments() {
  const [docs, setDocs] = useState<PersonalDocument[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [viewing, setViewing] = useState<PersonalDocument | null>(null);

  useEffect(() => { setDocs(getPersonalDocs()); }, []);

  function handleSaved() {
    setDocs(getPersonalDocs());
    setShowUpload(false);
  }

  function handleDelete(id: string) {
    deletePersonalDoc(id);
    setDocs(getPersonalDocs());
  }

  return (
    <div className="px-6 pt-2 pb-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#9ca3af" }}>My Documents</p>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl tap-active"
          style={{ background: "#eff6ff" }}>
          <Plus size={13} style={{ color: "#2563eb" }} />
          <span className="text-[11px] font-bold" style={{ color: "#2563eb" }}>Add</span>
        </button>
      </div>

      {docs.length === 0 ? (
        <button onClick={() => setShowUpload(true)}
          className="w-full rounded-2xl py-4 flex items-center gap-3 px-4 tap-active"
          style={{ background: "#f7f7f5", border: "1.5px dashed #e5e7eb" }}>
          <span className="text-[24px]">🪪</span>
          <div className="text-left">
            <p className="text-[13px] font-semibold" style={{ color: "#374151" }}>Add Aadhaar, PAN, Passport…</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>Upload once · use in every trip</p>
          </div>
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: "#f7f7f5" }}>
              <span className="text-[22px] shrink-0">{DOC_META[doc.type].emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#111827] truncate">{doc.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#9ca3af" }}>
                  Added {new Date(doc.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>
              <button onClick={() => setViewing(doc)}
                className="w-8 h-8 rounded-xl flex items-center justify-center tap-active"
                style={{ background: "#fff" }}>
                <Eye size={14} style={{ color: "#6b7280" }} />
              </button>
              <button onClick={() => handleDelete(doc.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center tap-active"
                style={{ background: "#fff1f2" }}>
                <Trash2 size={13} style={{ color: "#e11d48" }} />
              </button>
            </div>
          ))}
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl tap-active"
            style={{ background: "#f7f7f5", border: "1.5px dashed #e5e7eb" }}>
            <Plus size={14} style={{ color: "#9ca3af" }} />
            <span className="text-[12px] font-semibold" style={{ color: "#9ca3af" }}>Add another document</span>
          </button>
        </div>
      )}

      {showUpload && <UploadSheet onClose={() => setShowUpload(false)} onSave={() => handleSaved()} />}
      {viewing && <DocViewer doc={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
