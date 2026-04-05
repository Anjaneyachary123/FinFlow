import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/transactions";

export default function TransactionModal({ onClose, existing }) {
  const { dispatch } = useApp();
  const isEdit = Boolean(existing);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    category: "Food",
    type: "expense",
  });

  useEffect(() => {
    if (existing) setForm({ date: existing.date, amount: existing.amount, category: existing.category, type: existing.type });
  }, [existing]);

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!form.date) { setError("Please pick a date."); return; }

    const payload = { ...form, amount: Number(form.amount), ...(isEdit ? { id: existing.id } : {}) };

    dispatch({ type: isEdit ? "EDIT_TRANSACTION" : "ADD_TRANSACTION", payload });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)" }}>
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Type</label>
            <div className="flex gap-2">
              {["income", "expense"].map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{
                    flex: 1, padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font-body)",
                    border: form.type === t ? "none" : "1px solid var(--border)",
                    background: form.type === t
                      ? (t === "income" ? "var(--accent-green)" : "var(--accent-red)")
                      : "var(--bg-secondary)",
                    color: form.type === t ? "#0a0f1e" : "var(--text-secondary)",
                  }}
                >
                  {t === "income" ? "↑ Income" : "↓ Expense"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Amount (₹)</label>
            <input name="amount" type="number" value={form.amount} onChange={handleChange}
              className="fin-input" style={{ width: "100%" }} placeholder="e.g. 1500" />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="fin-input" style={{ width: "100%" }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange}
              className="fin-input" style={{ width: "100%" }} />
          </div>

          {error && <p style={{ color: "var(--accent-red)", fontSize: 12 }}>{error}</p>}

          <div className="flex gap-2 mt-2">
            <button onClick={onClose} className="fin-input" style={{ flex: 1, cursor: "pointer", textAlign: "center" }}>
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary" style={{ flex: 1 }}>
              {isEdit ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
