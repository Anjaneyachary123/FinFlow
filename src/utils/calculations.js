// ── Summary ──────────────────────────────────────────────
export function calculateSummary(transactions) {
  const totalIncome  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance      = totalIncome - totalExpense;
  const savingsRate  = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0.0";
  return { totalIncome, totalExpense, balance, savingsRate };
}

// ── Category breakdown (expenses) ────────────────────────
export function getCategoryBreakdown(transactions) {
  const expenses = transactions.filter(t => t.type === "expense");
  const map = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// ── Time series: daily running balance ────────────────────
export function getTimeSeriesData(transactions) {
  if (!transactions.length) return [];

  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let running = 0;
  const byDate = {};

  sorted.forEach(t => {
    running += t.type === "income" ? t.amount : -t.amount;
    byDate[t.date] = running;
  });

  return Object.entries(byDate).map(([date, balance]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    balance,
    rawDate: date,
  }));
}

// ── Monthly aggregation ───────────────────────────────────
export function getMonthlyData(transactions) {
  const map = {};
  transactions.forEach(t => {
    const key = t.date.slice(0, 7); // "2026-03"
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    if (t.type === "income")  map[key].income  += t.amount;
    if (t.type === "expense") map[key].expense += t.amount;
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      month: new Date(key + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      ...val,
      net: val.income - val.expense,
    }));
}

// ── Insights ──────────────────────────────────────────────
export function getInsights(transactions) {
  const breakdown = getCategoryBreakdown(transactions);
  const monthly   = getMonthlyData(transactions);

  const highest = breakdown[0] || null;

  // Current vs previous month
  const months  = monthly.slice().reverse();
  const current = months[0] || null;
  const prev    = months[1] || null;
  let monthCompare = null;
  if (current && prev) {
    const diff  = current.expense - prev.expense;
    const pct   = prev.expense > 0 ? ((Math.abs(diff) / prev.expense) * 100).toFixed(1) : 0;
    monthCompare = { diff, pct, direction: diff > 0 ? "up" : "down", month: current.month, prevMonth: prev.month };
  }

  // Savings rate
  const { totalIncome, balance } = calculateSummary(transactions);
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Most frequent expense category
  const freqMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    freqMap[t.category] = (freqMap[t.category] || 0) + 1;
  });
  const mostFrequent = Object.entries(freqMap).sort((a, b) => b[1] - a[1])[0];

  // Average transaction
  const avgExpense = transactions.filter(t => t.type === "expense").length > 0
    ? (transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) /
       transactions.filter(t => t.type === "expense").length).toFixed(0)
    : 0;

  return { highest, monthCompare, savingsRate, mostFrequent, avgExpense };
}

// ── Formatters ────────────────────────────────────────────
export function fmtCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

// ── CSV Export ────────────────────────────────────────────
export function exportCSV(transactions) {
  const header = "ID,Date,Amount,Category,Type\n";
  const rows   = transactions.map(t => `${t.id},${t.date},${t.amount},${t.category},${t.type}`).join("\n");
  const blob   = new Blob([header + rows], { type: "text/csv" });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement("a");
  a.href = url; a.download = "transactions.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ── Generate unique ID ────────────────────────────────────
export function genId() {
  return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
