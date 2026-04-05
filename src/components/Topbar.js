import React from "react";
import { Menu, Sun, Moon, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import { exportCSV } from "../utils/calculations";

export default function Topbar({ onMenuClick }) {
  const { state, dispatch } = useApp();

  const tabLabels = { dashboard: "Dashboard", transactions: "Transactions", insights: "Insights" };

  return (
    <header style={{
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px",
      height: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 30,
    }}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          // className="md:hidden"
          className="hamburger-btn"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)" }}>
          {tabLabels[state.activeTab]}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Export CSV */}
        {state.activeTab === "transactions" && (
          <button
            onClick={() => exportCSV(state.transactions)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(16,217,138,0.08)", color: "var(--accent-green)",
              border: "1px solid rgba(16,217,138,0.2)", borderRadius: 8,
              padding: "6px 14px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font-body)"
            }}
          >
            <Download size={13} /> Export CSV
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={() => dispatch({ type: "TOGGLE_THEME" })}
          style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "7px 10px", cursor: "pointer",
            color: "var(--text-secondary)", display: "flex", alignItems: "center"
          }}
        >
          {state.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
