import React from "react";
import { fmtCurrency } from "../utils/calculations";

export default function SummaryCard({ label, value, icon, accent, change, isCurrency = true, stagger }) {
  const accentMap = {
    green:  { color: "var(--accent-green)",  bg: "rgba(16,217,138,0.08)"  },
    red:    { color: "var(--accent-red)",    bg: "rgba(244,63,94,0.08)"   },
    blue:   { color: "var(--accent-blue)",   bg: "rgba(59,130,246,0.08)"  },
    amber:  { color: "var(--accent-amber)",  bg: "rgba(245,158,11,0.08)"  },
    purple: { color: "var(--accent-purple)", bg: "rgba(168,85,247,0.08)"  },
  };
  const { color, bg } = accentMap[accent] || accentMap.blue;

  return (
    <div className={`card p-5 animate-fade-in stagger-${stagger || 1}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <span style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
            {label}
          </span>
          <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {isCurrency ? fmtCurrency(value) : value}
          </span>
        </div>
        <div style={{ background: bg, borderRadius: 12, padding: "10px", color, flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          <span style={{ color, fontWeight: 600 }}>{change}</span>
          <span> vs last month</span>
        </div>
      )}
    </div>
  );
}
