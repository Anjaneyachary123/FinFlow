import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { useApp } from "../context/AppContext";
import SummaryCard from "../components/SummaryCard";
import {
  calculateSummary,
  getCategoryBreakdown,
  getTimeSeriesData,
  getMonthlyData,
  fmtCurrency,
} from "../utils/calculations";
import { CATEGORY_COLORS } from "../data/transactions";

// Custom tooltip for line chart
function LineTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "10px 14px", fontSize: 13,
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>{payload[0]?.payload?.date}</p>
      <p style={{ color: "var(--accent-green)", fontWeight: 700 }}>{fmtCurrency(payload[0]?.value)}</p>
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "10px 14px", fontSize: 13,
    }}>
      <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>{payload[0].name}</p>
      <p style={{ color: "var(--text-secondary)" }}>{fmtCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function Dashboard() {
  const { state } = useApp();
  const { transactions } = state;

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Wallet size={40} style={{ color: "var(--text-muted)" }} />
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>No transactions yet. Add some to see your dashboard.</p>
      </div>
    );
  }

  const { totalIncome, totalExpense, balance, savingsRate } = calculateSummary(transactions);
  const breakdown  = getCategoryBreakdown(transactions);
  const timeSeries = getTimeSeriesData(transactions);
  const monthly    = getMonthlyData(transactions);

  // Monthly change for summary cards
  const months = monthly.slice().reverse();
  const curMo  = months[0];
  const prevMo = months[1];
  const incomeChange  = prevMo ? (((curMo?.income  - prevMo?.income)  / (prevMo?.income  || 1)) * 100).toFixed(1) : null;
  const expenseChange = prevMo ? (((curMo?.expense - prevMo?.expense) / (prevMo?.expense || 1)) * 100).toFixed(1) : null;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Balance" value={balance} icon={<Wallet size={18} />}
          accent={balance >= 0 ? "green" : "red"} stagger={1}
        />
        <SummaryCard
          label="Total Income" value={totalIncome} icon={<TrendingUp size={18} />}
          accent="green" change={incomeChange ? `${incomeChange > 0 ? "+" : ""}${incomeChange}%` : undefined} stagger={2}
        />
        <SummaryCard
          label="Total Expenses" value={totalExpense} icon={<TrendingDown size={18} />}
          accent="red" change={expenseChange ? `${expenseChange > 0 ? "+" : ""}${expenseChange}%` : undefined} stagger={3}
        />
        <SummaryCard
          label="Savings Rate" value={`${savingsRate}%`} icon={<Percent size={18} />}
          accent="amber" isCurrency={false} stagger={4}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Line chart — balance trend */}
        <div className="card p-5 lg:col-span-2 animate-fade-in stagger-2">
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>
            Balance Trend
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<LineTooltip />} />
              <Line
                type="monotone" dataKey="balance" stroke="var(--accent-green)"
                strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "var(--accent-green)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — expense breakdown */}
        <div className="card p-5 animate-fade-in stagger-3">
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>
            Expense Breakdown
          </p>
          {breakdown.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", paddingTop: 60 }}>No expenses</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={breakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  paddingAngle={3} dataKey="value">
                  {breakdown.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={v => <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly bar overview */}
      <div className="card p-5 animate-fade-in stagger-4">
        <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>
          Monthly Overview
        </p>
        <div className="overflow-x-auto">
          <table className="fin-table">
            <thead>
              <tr>
                {["Month", "Income", "Expenses", "Net"].map(h => (
                  <th key={h} style={{ cursor: "default" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthly.slice().reverse().map(row => (
                <tr key={row.month}>
                  <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{row.month}</td>
                  <td className="mono" style={{ color: "var(--accent-green)" }}>{fmtCurrency(row.income)}</td>
                  <td className="mono" style={{ color: "var(--accent-red)" }}>{fmtCurrency(row.expense)}</td>
                  <td className="mono" style={{ color: row.net >= 0 ? "var(--accent-green)" : "var(--accent-red)", fontWeight: 700 }}>
                    {row.net >= 0 ? "+" : ""}{fmtCurrency(row.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
