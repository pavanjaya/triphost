"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const EXPENSE_CATS = ["🍽 Food", "🚗 Transport", "🛍 Shopping", "🎡 Activities", "💊 Medical", "🔧 Other"];

type Expense = { id: number; amount: number; category: string; note: string; by: string };

export default function ExpensesScreen({ groupSize }: { groupSize: number }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState(EXPENSE_CATS[0]);
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = groupSize > 0 ? Math.round(total / groupSize) : 0;

  function add() {
    const n = parseFloat(amount);
    if (!n) return;
    setExpenses(prev => [...prev, { id: Date.now(), amount: n, category: cat, note, by: "You" }]);
    setAmount(""); setNote(""); setAdding(false);
  }

  const byCat = EXPENSE_CATS.map(c => ({
    cat: c,
    total: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0);

  return (
    <div className="scroll-hide overflow-y-auto h-full" style={{ background: "#f7f7f5" }}>
      <div className="px-5 pt-12 pb-5">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>Group · 8 travellers</p>
        <h2 className="text-[26px] font-bold text-[#111827]">Expenses</h2>
      </div>

      {/* Summary cards */}
      <div className="px-4 mb-4 flex gap-3">
        <div className="flex-1 rounded-3xl px-4 py-4 text-center" style={{ background: "#1a2744" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Total spent</p>
          <p className="text-[28px] font-black text-white leading-none">₹{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="flex-1 rounded-3xl px-4 py-4 text-center" style={{ background: "#fff" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>Per person</p>
          <p className="text-[28px] font-black text-[#111827] leading-none">₹{perPerson.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Category breakdown */}
      {byCat.length > 0 && (
        <div className="px-4 mb-4">
          <div className="rounded-3xl overflow-hidden" style={{ background: "#fff" }}>
            <p className="px-5 pt-4 pb-2 text-[11px] font-bold tracking-widest uppercase" style={{ color: "#9ca3af" }}>By category</p>
            {byCat.map((c, i) => (
              <div key={c.cat} className="flex items-center gap-3 px-5 py-3" style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                <span className="text-xl shrink-0">{c.cat.split(" ")[0]}</span>
                <p className="flex-1 text-[13px] font-bold text-[#111827]">{c.cat.slice(2)}</p>
                <p className="text-[13px] font-bold" style={{ color: "#2563eb" }}>₹{c.total.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense list */}
      {expenses.length > 0 && (
        <div className="px-4 mb-4 flex flex-col gap-2">
          {expenses.map(e => (
            <div key={e.id} className="rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{ background: "#fff" }}>
              <span className="text-xl shrink-0">{e.category.split(" ")[0]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#111827]">₹{e.amount.toLocaleString("en-IN")}</p>
                {e.note && <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{e.note}</p>}
                <p className="text-[10px] mt-0.5" style={{ color: "#d1d5db" }}>Added by {e.by}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "#eff6ff", color: "#2563eb" }}>{e.category.slice(2)}</span>
              <button onClick={() => setExpenses(p => p.filter(x => x.id !== e.id))} className="tap-active shrink-0 ml-1" style={{ color: "#d1d5db" }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      <div className="px-4 mb-8">
        {adding ? (
          <div className="rounded-3xl p-4 flex flex-col gap-3" style={{ background: "#fff" }}>
            <p className="text-[13px] font-bold text-[#111827]">New expense</p>
            <input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-[16px] font-bold outline-none"
              style={{ background: "#f7f7f5", color: "#111827" }} />
            <input type="text" placeholder="What was it for? (optional)" value={note} onChange={e => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-[13px] outline-none"
              style={{ background: "#f7f7f5", color: "#111827" }} />
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold tap-active"
                  style={{ background: cat === c ? "#1a2744" : "#f7f7f5", color: cat === c ? "#fff" : "#6b7280" }}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={() => setAdding(false)} className="flex-1 py-3 rounded-2xl text-[13px] font-bold tap-active" style={{ background: "#f7f7f5", color: "#6b7280" }}>Cancel</button>
              <button onClick={add} className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-white tap-active" style={{ background: "#1a2744" }}>Add</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="flex items-center justify-center gap-2 w-full py-4 rounded-3xl text-[14px] font-bold text-white tap-active"
            style={{ background: "#1a2744" }}>
            <Plus size={17} /> Add Expense
          </button>
        )}
      </div>
    </div>
  );
}
