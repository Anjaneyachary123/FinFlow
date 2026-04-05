# FinFlow — Finance Dashboard UI

> A production-quality personal finance dashboard built with React + Tailwind CSS.

![FinFlow Dashboard](https://via.placeholder.com/1200x600/0a0f1e/10d98a?text=FinFlow+Finance+Dashboard)

---

## Project Overview

**FinFlow** is a clean, interactive finance dashboard that lets users track income, expenses, and spending patterns — all derived from a single source-of-truth data file. Built as a frontend internship assignment for Zorvyn FinTech, it demonstrates strong engineering decisions in architecture, UX, and data handling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (functional components + hooks) |
| Styling | Tailwind CSS + custom CSS variables |
| Charts | Recharts |
| Icons | Lucide React |
| State | Context API + useReducer |
| Persistence | localStorage |
| Language | JavaScript only (no TypeScript) |

---

## Features Breakdown

### 1. Dashboard Overview
- **Summary Cards**: Balance, Total Income, Total Expenses, Savings Rate — all derived from transaction data
- **Line Chart**: Running balance trend over time
- **Pie Chart**: Expense breakdown by category (donut style)
- **Monthly Table**: Month-by-month income vs expense grid

### 2. Transactions Section
- Full sortable, filterable, searchable table
- Search by category or amount
- Filter by type (income/expense) and category
- Sort by date or amount (ascending/descending)
- Export to CSV
- Pagination count display

### 3. Role-Based UI
- Role selector in sidebar (Viewer / Admin)
- **Viewer**: read-only, sees data but no edit controls
- **Admin**: full CRUD — Add, Edit, Delete transactions via modal
- Role persisted in localStorage

### 4. Insights Section
- Top spending category with total amount
- Savings rate with health indicator
- Month-over-month expense comparison (% change)
- Average expense per transaction + most frequent category
- Category progress bars with percentage breakdown
- Monthly income vs expense bar chart

---

## Data Handling

All UI is derived from a single source of truth:

```
src/data/transactions.js
```

**No hardcoded summaries, chart values, or insight text** — everything is computed via:

```
src/utils/calculations.js
```

Key functions:
- `calculateSummary(transactions)` — balance, income, expenses, savings rate
- `getCategoryBreakdown(transactions)` — expense totals per category
- `getTimeSeriesData(transactions)` — daily running balance for line chart
- `getMonthlyData(transactions)` — monthly aggregation for bar chart + table
- `getInsights(transactions)` — all insight card values
- `fmtCurrency(amount)` — INR formatting
- `exportCSV(transactions)` — download as CSV

---

## State Management

Uses **Context API + useReducer** (no external library needed for this scale).

**AppContext** manages:
- `transactions` — full list, persisted to localStorage
- `role` — viewer | admin, persisted
- `theme` — dark | light, persisted
- `activeTab` — current page
- `filters` — search, type, category, sort

Derived state (`filteredTransactions`) is computed inside the provider on every render — no stale data, no prop drilling.

---

## Folder Structure

```
src/
├── components/         # Reusable UI: SummaryCard, Sidebar, Topbar, TransactionModal
├── context/            # AppContext (state + dispatch)
├── data/               # transactions.js — single source of truth
├── features/           # Page-level: Dashboard, Transactions, Insights
├── utils/              # calculations.js — pure business logic
├── App.js
├── index.js
└── index.css           # Global styles + CSS variables
```

---

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
# http://localhost:3000
```

> **Note:** Uses `react-scripts` (Create React App) for zero-config setup.

---

## Design Decisions

### Dark-first with light mode toggle
Finance apps are often used in low-light environments (trading desks, late night reviews). Dark mode is the default, with a clean light mode available via the sun/moon icon.

### CSS Variables for theming
Instead of Tailwind's `dark:` prefixes everywhere, all colors are CSS custom properties. Toggling `.light` on `<body>` instantly repaints the entire app — no React re-renders needed for theming.

### Typography
- **DM Serif Display** — display headings, gives an editorial/premium feel
- **Syne** — body text, modern and clean with slight personality
- **DM Mono** — all numbers/amounts, ensures aligned, readable financial data

### Separation of concerns
Business logic lives entirely in `utils/calculations.js`. Components only render — they never compute summaries inline. This makes testing and future API integration trivial.

### Recharts over other libraries
Lightweight, composable, works natively with React state — no wrappers or plugins needed.

---

## Limitations

- No backend — all data is static/mock + localStorage
- Roles are simulated frontend-only; no authentication
- localStorage resets if browser data is cleared
- No real-time data or WebSocket updates

---

## Future Improvements

- **API Integration**: Replace mock data with REST or GraphQL endpoints
- **Authentication**: JWT-based login with real RBAC
- **Advanced Analytics**: Budget planning, goal tracking, forecasting
- **Multi-currency**: Exchange rate API integration
- **Notifications**: Alerts for budget thresholds
- **Mobile App**: React Native port using the same business logic

---

## Assignment Info

| Field | Value |
|---|---|
| Candidate | Anjaneya Narsingoju |
| Email | anjaneyulunarsingoju81@gmail.com |
| Role | Frontend Developer Intern |
| Company | Zorvyn FinTech |
| Deadline | Mon, 06 Apr 2026 10:00 PM |
