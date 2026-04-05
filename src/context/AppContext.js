import React, { createContext, useContext, useReducer, useEffect } from "react";
import { transactions as initialData } from "../data/transactions";
import { genId } from "../utils/calculations";

// ── State shape ──────────────────────────────────────────
const INITIAL_STATE = {
  transactions: [],
  role: "viewer",           // "viewer" | "admin"
  theme: "dark",            // "dark" | "light"
  activeTab: "dashboard",   // "dashboard" | "transactions" | "insights"
  filters: {
    search: "",
    type: "all",            // "all" | "income" | "expense"
    category: "all",
    sortBy: "date",         // "date" | "amount"
    sortDir: "desc",        // "asc" | "desc"
  },
};

// ── Reducer ───────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, transactions: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "ADD_TRANSACTION": {
      const tx = { ...action.payload, id: genId() };
      const updated = [tx, ...state.transactions];
      localStorage.setItem("fin_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    case "EDIT_TRANSACTION": {
      const updated = state.transactions.map(t => t.id === action.payload.id ? action.payload : t);
      localStorage.setItem("fin_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    case "DELETE_TRANSACTION": {
      const updated = state.transactions.filter(t => t.id !== action.payload);
      localStorage.setItem("fin_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // LocalStorage persistence
  useEffect(() => {
    const stored = localStorage.getItem("fin_transactions");
    const theme  = localStorage.getItem("fin_theme") || "dark";
    const role   = localStorage.getItem("fin_role")  || "viewer";
    dispatch({ type: "INIT", payload: stored ? JSON.parse(stored) : initialData });
    if (theme !== "dark") dispatch({ type: "TOGGLE_THEME" });
    dispatch({ type: "SET_ROLE", payload: role });
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.className = state.theme === "light" ? "light" : "";
    localStorage.setItem("fin_theme", state.theme);
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem("fin_role", state.role);
  }, [state.role]);

  // Derived: filtered + sorted transactions
  const filteredTransactions = (() => {
    const { search, type, category, sortBy, sortDir } = state.filters;
    let list = [...state.transactions];
    if (search)           list = list.filter(t => t.category.toLowerCase().includes(search.toLowerCase()) || t.amount.toString().includes(search));
    if (type !== "all")   list = list.filter(t => t.type === type);
    if (category !== "all") list = list.filter(t => t.category === category);
    list.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortBy === "amount") return mul * (a.amount - b.amount);
      return mul * (new Date(a.date) - new Date(b.date));
    });
    return list;
  })();

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTransactions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
