import { useState } from "react";

const mockData = {
  revenue: 1250000,
  totalPesanan: 24,
  menunggu: 5,
  selesai: 19,
  menuTerlaris: [
    { name: "Kopi Susu Gula Aren", terjual: 42, harga: 28000 },
    { name: "Es Matcha Latte", terjual: 35, harga: 32000 },
    { name: "Americano", terjual: 28, harga: 22000 },
  ],
  pesananTerbaru: [
    { id: "#001", pelanggan: "Budi Santoso", menu: "Kopi Susu Gula Aren", status: "selesai", total: 28000 },
    { id: "#002", pelanggan: "Siti Rahayu", menu: "Es Matcha Latte", status: "menunggu", total: 32000 },
    { id: "#003", pelanggan: "Andi Wijaya", menu: "Americano x2", status: "menunggu", total: 44000 },
    { id: "#004", pelanggan: "Dewi Lestari", menu: "Kopi Susu Gula Aren", status: "selesai", total: 28000 },
  ],
};

const emptyData = {
  revenue: 0,
  totalPesanan: 0,
  menunggu: 0,
  selesai: 0,
  menuTerlaris: [],
  pesananTerbaru: [],
};

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "menu", label: "Kelola Menu", icon: "🍽" },
  { id: "pesanan", label: "Pesanan", icon: "🛒" },
  { id: "pengguna", label: "Pengguna", icon: "👤" },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [useMock, setUseMock] = useState(false);

  const data = useMock ? mockData : emptyData;

  const statCards = [
    {
      label: "Total Revenue",
      value: formatRupiah(data.revenue),
      icon: "$",
      bg: "#F97316",
    },
    {
      label: "Total Pesanan",
      value: data.totalPesanan,
      icon: "🛒",
      bg: "#3B82F6",
    },
    {
      label: "Menunggu",
      value: data.menunggu,
      icon: "⏱",
      bg: "#EAB308",
    },
    {
      label: "Selesai",
      value: data.selesai,
      icon: "✓",
      bg: "#22C55E",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F5F1EB", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#F97316", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18,
            }}>☕</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1F2937" }}>BrewMate Admin</span>
          </div>
          <button
            onClick={() => {}}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#6B7280", fontSize: 14, display: "flex", alignItems: "center", gap: 4,
            }}
          >
            ← Ke Toko
          </button>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeNav === item.id ? "2px solid #F97316" : "2px solid transparent",
                color: activeNav === item.id ? "#F97316" : "#6B7280",
                fontWeight: activeNav === item.id ? 600 : 400,
                fontSize: 14,
                padding: "12px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
        {/* Toggle demo data */}
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 13, color: "#6B7280" }}>Tampilkan data contoh:</label>
          <button
            onClick={() => setUseMock(!useMock)}
            style={{
              background: useMock ? "#F97316" : "#E5E7EB",
              color: useMock ? "#fff" : "#374151",
              border: "none", borderRadius: 20,
              padding: "4px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500,
              transition: "background 0.2s",
            }}
          >
            {useMock ? "Aktif" : "Nonaktif"}
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16, marginBottom: 20,
        }}>
          {statCards.map((card) => (
            <div key={card.label} style={{
              background: "#fff", borderRadius: 16,
              padding: "20px 20px 16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: card.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, color: "#fff", marginBottom: 14,
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
                {card.value}
              </div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Menu Terlaris */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ color: "#F97316", fontSize: 18 }}>★</span>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Menu Terlaris</span>
            </div>
            {data.menuTerlaris.length === 0 ? (
              <p style={{ color: "#9CA3AF", fontSize: 14, margin: 0 }}>Belum ada data</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.menuTerlaris.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", background: "#FFF7ED", borderRadius: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "#F97316", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {i + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>{formatRupiah(item.harga)}</div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: "#F97316",
                      background: "#FEE2D0", padding: "2px 10px", borderRadius: 20,
                    }}>
                      {item.terjual} terjual
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pesanan Terbaru */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ color: "#F97316", fontSize: 18 }}>🛒</span>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Pesanan Terbaru</span>
            </div>
            {data.pesananTerbaru.length === 0 ? (
              <p style={{ color: "#9CA3AF", fontSize: 14, margin: 0 }}>Belum ada pesanan</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.pesananTerbaru.map((order) => (
                  <div key={order.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "#F9FAFB",
                    borderRadius: 10,
                    borderLeft: `3px solid ${order.status === "selesai" ? "#22C55E" : "#EAB308"}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>
                        {order.id} · {order.pelanggan}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{order.menu}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                        {formatRupiah(order.total)}
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: order.status === "selesai" ? "#DCFCE7" : "#FEF9C3",
                        color: order.status === "selesai" ? "#166534" : "#854D0E",
                      }}>
                        {order.status === "selesai" ? "Selesai" : "Menunggu"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}