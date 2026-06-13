import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

function formatRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

const STATUS_LABEL = { menunggu: "Menunggu", diproses: "Diproses", selesai: "Selesai" };
const STATUS_COLOR = {
  menunggu: { bg: "#FEF9C3", color: "#854D0E" },
  diproses: { bg: "#DBEAFE", color: "#1E40AF" },
  selesai:  { bg: "#DCFCE7", color: "#166534" },
};

export default function Admin() {
  const [activeNav, setActiveNav] = useState("dashboard");
  return (
    <div style={{ minHeight: "100vh", background: "#F5F1EB", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>☕</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1F2937" }}>BrewMate Admin</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[{id:"dashboard",label:"Dashboard"},{id:"menu",label:"Kelola Menu"},{id:"pesanan",label:"Pesanan"}].map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              style={{ background: "none", border: "none", borderBottom: activeNav === item.id ? "2px solid #F97316" : "2px solid transparent", color: activeNav === item.id ? "#F97316" : "#6B7280", fontWeight: activeNav === item.id ? 600 : 400, fontSize: 14, padding: "12px 16px", cursor: "pointer" }}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {activeNav === "dashboard" && <Dashboard />}
        {activeNav === "menu" && <KelollaMenu />}
        {activeNav === "pesanan" && <Pesanan />}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

function formatRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

const STATUS_LABEL = { menunggu: "Menunggu", diproses: "Diproses", selesai: "Selesai" };
const STATUS_COLOR = {
  menunggu: { bg: "#FEF9C3", color: "#854D0E" },
  diproses: { bg: "#DBEAFE", color: "#1E40AF" },
  selesai:  { bg: "#DCFCE7", color: "#166534" },
};

export default function Admin() {
  const [activeNav, setActiveNav] = useState("dashboard");
  return (
    <div style={{ minHeight: "100vh", background: "#F5F1EB", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>☕</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1F2937" }}>BrewMate Admin</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[{id:"dashboard",label:"Dashboard"},{id:"menu",label:"Kelola Menu"},{id:"pesanan",label:"Pesanan"}].map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              style={{ background: "none", border: "none", borderBottom: activeNav === item.id ? "2px solid #F97316" : "2px solid transparent", color: activeNav === item.id ? "#F97316" : "#6B7280", fontWeight: activeNav === item.id ? 600 : 400, fontSize: 14, padding: "12px 16px", cursor: "pointer" }}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {activeNav === "dashboard" && <Dashboard />}
        {activeNav === "menu" && <KelollaMenu />}
        {activeNav === "pesanan" && <Pesanan />}
      </div>
    </div>
  );
}