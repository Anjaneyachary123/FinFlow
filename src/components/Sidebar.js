import React from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  TrendingUp,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  {
    id: "transactions",
    label: "Transactions",
    icon: <ArrowLeftRight size={17} />,
  },
  { id: "insights", label: "Insights", icon: <Lightbulb size={17} /> },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
          width: 220,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transition: "transform 0.25s ease",
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
        // className={`${mobileOpen ? "" : "-translate-x-full md:translate-x-0"}`}
        className={mobileOpen ? "" : "sidebar-hidden"}
        
      >
        {/* Logo */}
        <div
          style={{ padding: "0 20px 28px" }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              style={{
                background: "var(--accent-green)",
                borderRadius: 8,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={16} color="#0a0f1e" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                color: "var(--text-primary)",
              }}
            >
              FinFlow
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden"
            style={{
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                dispatch({ type: "SET_TAB", payload: item.id });
                onClose();
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "11px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                fontWeight: state.activeTab === item.id ? 600 : 400,
              }}
              className={`nav-item ${state.activeTab === item.id ? "nav-active" : ""}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer: role selector */}
        <div style={{ padding: "20px", borderTop: "1px solid var(--border)" }}>
          <p
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Role
          </p>
          <select
            value={state.role}
            onChange={(e) =>
              dispatch({ type: "SET_ROLE", payload: e.target.value })
            }
            className="fin-input"
            style={{ width: "100%" }}
          >
            <option value="viewer">👁 Viewer</option>
            <option value="admin">⚡ Admin</option>
          </select>
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${state.role === "admin" ? "role-admin" : "role-viewer"}`}
            >
              {state.role === "admin" ? "Admin Access" : "Read Only"}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
