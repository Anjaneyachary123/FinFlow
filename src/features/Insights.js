import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { TrendingUp, TrendingDown, Zap, PiggyBank, RefreshCw, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getInsights, getCategoryBreakdown, getMonthlyData, fmtCurrency } from "../utils/calculations";
import { CATEGORY_COLORS } from "../data/transactions";

function InsightCard({ icon, label, value, sub, accent, stagger }) {
  const accentClass = {
    green: "insight-green", red: "insight-red", blue: "insight-blue", amber: "insight-amber"
  }[accent] || "insight-blue";

  return (
    <div className={`card p-5 insight-card ${accentClass} animate-fade-in stagger-${stagger}`}>
      <div className="flex items-start gap-3">
        <div style={{
          background: accent === "green" ? "rgba(16,217,138,0.1)"
            : accent === "red"   ? "rgba(244,63,94,0.1)"
            : accent === "amber" ? "rgba(245,158,11,0.1)"
            : "rgba(59,130,246,0.1)",
          color: accent === "green" ? "var(--accent-green)"
            : accent === "red"   ? "var(--accent-red)"
            : accent === "amber" ? "var(--accent-amber)"
            : "var(--accent-blue)",
          borderRadius: 10, padding: 10, flexShrink: 0
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
            {label}
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function BarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
      <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>{payload[0]?.payload?.month}</p>
      <p style={{ color: "var(--accent-green)" }}>Income: {fmtCurrency(payload[0]?.payload?.income)}</p>
      <p style={{ color: "var(--accent-red)" }}>Expense: {fmtCurrency(payload[0]?.payload?.expense)}</p>
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle size={40} style={{ color: "var(--text-muted)" }} />
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>No data to show insights. Add transactions first.</p>
      </div>
    );
  }

  const { highest, monthCompare, savingsRate, mostFrequent, avgExpense } = getInsights(transactions);
  const monthly   = getMonthlyData(transactions);
  const breakdown = getCategoryBreakdown(transactions);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Insight cards row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          icon={<Zap size={18} />}
          label="Top Spending"
          value={highest?.name || "—"}
          sub={highest ? `${fmtCurrency(highest.value)} total spent` : "No expenses"}
          accent="red" stagger={1}
        />
        <InsightCard
          icon={<PiggyBank size={18} />}
          label="Savings Rate"
          value={`${savingsRate}%`}
          sub={Number(savingsRate) >= 20 ? "Healthy savings 🎉" : "Try to save more"}
          accent={Number(savingsRate) >= 20 ? "green" : "amber"} stagger={2}
        />
        {monthCompare && (
          <InsightCard
            icon={monthCompare.direction === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            label="Month-over-Month"
            value={`${monthCompare.direction === "up" ? "+" : "-"}${monthCompare.pct}%`}
            sub={`Spending vs ${monthCompare.prevMonth}`}
            accent={monthCompare.direction === "up" ? "red" : "green"} stagger={3}
          />
        )}
        <InsightCard
          icon={<RefreshCw size={18} />}
          label="Avg Expense"
          value={fmtCurrency(avgExpense)}
          sub={mostFrequent ? `Most frequent: ${mostFrequent[0]} (${mostFrequent[1]}x)` : ""}
          accent="blue" stagger={4}
        />
      </div>

      {/* Monthly income vs expense bar chart */}
      <div className="card p-5 animate-fade-in stagger-2">
        <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>
          Monthly Income vs Expense
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthly} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<BarTooltip />} />
            <Bar dataKey="income"  fill="var(--accent-green)" radius={[4,4,0,0]} />
            <Bar dataKey="expense" fill="var(--accent-red)"   radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--accent-green)", display: "inline-block" }} /> Income
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--accent-red)", display: "inline-block" }} /> Expense
          </span>
        </div>
      </div>

      {/* Category breakdown table */}
      <div className="card p-5 animate-fade-in stagger-3">
        <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>
          Spending by Category
        </p>
        <div className="flex flex-col gap-3">
          {breakdown.map((item, i) => {
            const total = breakdown.reduce((s, x) => s + x.value, 0);
            const pct   = total ? ((item.value / total) * 100).toFixed(1) : 0;
            const color = CATEGORY_COLORS[item.name] || "#6b7280";
            return (
              <div key={item.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                  <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                    {item.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", color: color, fontWeight: 600 }}>
                    {fmtCurrency(item.value)} <span style={{ color: "var(--text-muted)", fontSize: 11 }}>({pct}%)</span>
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, background: "var(--bg-secondary)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: color, borderRadius: 99,
                    transition: "width 0.6s ease",
                    animationDelay: `${i * 0.05}s`
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
