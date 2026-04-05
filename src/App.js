import React, { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./features/Dashboard";
import Transactions from "./features/Transactions";
import Insights from "./features/Insights";
import { useApp } from "./context/AppContext";

function AppInner() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabMap = {
    dashboard:    <Dashboard />,
    transactions: <Transactions />,
    insights:     <Insights />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
    
      {/* Mesh background */}
      <div className="mesh-bg" />

      {/* Sidebar */}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area — offset by sidebar width on desktop */}
      {/* <div style={{ flex: 1, marginLeft:0, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}
        className="md:ml-[220px]"> */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1, marginLeft: 220 }}
  className="main-content">
       
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {tabMap[state.activeTab] || <Dashboard />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
