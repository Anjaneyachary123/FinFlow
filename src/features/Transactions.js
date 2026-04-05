import React, { useState } from "react";
import { Search, Plus, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import TransactionModal from "../components/TransactionModal";
import { fmtDate, fmtCurrency } from "../utils/calculations";
import { CATEGORIES, CATEGORY_COLORS } from "../data/transactions";

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field) return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
  return sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
}

export default function Transactions() {
  const { state, dispatch, filteredTransactions } = useApp();
  const { filters, role } = state;
  const isAdmin = role === "admin";

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  function setFilter(obj) {
    dispatch({ type: "SET_FILTER", payload: obj });
  }
  function toggleSort(field) {
    if (filters.sortBy === field) {
      setFilter({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      setFilter({ sortBy: field, sortDir: "desc" });
    }
  }

  function handleDelete(id) {
    if (window.confirm("Delete this transaction?")) {
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
    }
  }

  function openEdit(tx) {
    setEditTarget(tx);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 180px", minWidth: 180 }}>
          <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            value={filters.search}
            onChange={e => setFilter({ search: e.target.value })}
            placeholder="Search category or amount…"
            className="fin-input"
            style={{ width: "100%", paddingLeft: 32 }}
          />
        </div>

        {/* Type filter */}
        <select value={filters.type} onChange={e => setFilter({ type: e.target.value })} className="fin-input" style={{ minWidth: 130 }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter */}
        <select value={filters.category} onChange={e => setFilter({ category: e.target.value })} className="fin-input" style={{ minWidth: 140 }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Admin: add button */}
        {isAdmin && (
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> Add Transaction
          </button>
        )}
      </div>

      {/* Role banner */}
      {!isAdmin && (
        <div style={{
          background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "var(--accent-blue)"
        }}>
          👁 Viewer mode — switch to Admin to add, edit, or delete transactions.
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16">
              <Search size={32} style={{ color: "var(--text-muted)" }} />
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No transactions match your filters.</p>
              <button onClick={() => dispatch({ type: "SET_FILTER", payload: { search: "", type: "all", category: "all" } })}
                style={{ fontSize: 12, color: "var(--accent-green)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Clear filters
              </button>
            </div>
          ) : (
            <table className="fin-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort("date")} className="flex items-center gap-1">
                    Date <SortIcon field="date" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                  </th>
                  <th>Category</th>
                  <th>Type</th>
                  <th onClick={() => toggleSort("amount")} style={{ cursor: "pointer" }}>
                    <span className="flex items-center gap-1">
                      Amount <SortIcon field="amount" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                    </span>
                  </th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, i) => (
                  <tr key={tx.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.03}s`, opacity: 0, animationFillMode: "forwards" }}>
                    <td style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                      {fmtDate(tx.date)}
                    </td>
                    <td>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: `${CATEGORY_COLORS[tx.category] || "#6b7280"}18`,
                        color: CATEGORY_COLORS[tx.category] || "#6b7280",
                        border: `1px solid ${CATEGORY_COLORS[tx.category] || "#6b7280"}30`,
                        borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600,
                      }}>
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.type === "income" ? "badge-income" : "badge-expense"}`}>
                        {tx.type === "income" ? "↑ Income" : "↓ Expense"}
                      </span>
                    </td>
                    <td className="mono" style={{
                      fontWeight: 700, fontSize: 14,
                      color: tx.type === "income" ? "var(--accent-green)" : "var(--accent-red)"
                    }}>
                      {tx.type === "income" ? "+" : "-"}{fmtCurrency(tx.amount)}
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(tx)} className="btn-edit flex items-center gap-1">
                            <Pencil size={11} /> Edit
                          </button>
                          <button onClick={() => handleDelete(tx.id)} className="btn-danger flex items-center gap-1">
                            <Trash2 size={11} /> Del
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {filteredTransactions.length > 0 && (
          <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
            Showing {filteredTransactions.length} of {state.transactions.length} transactions
          </div>
        )}
      </div>

      {modalOpen && <TransactionModal onClose={closeModal} existing={editTarget} />}
    </div>
  );
}
