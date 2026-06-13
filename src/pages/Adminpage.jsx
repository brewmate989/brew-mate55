import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// ─── helpers ────────────────────────────────────────────────────
function formatRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

const STATUS_LABEL = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
};

const STATUS_COLOR = {
  menunggu: { bg: "#FEF9C3", color: "#854D0E" },
  diproses: { bg: "#DBEAFE", color: "#1E40AF" },
  selesai:  { bg: "#DCFCE7", color: "#166534" },
};

// ─── DASHBOARD ───────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, total: 0, menunggu: 0, selesai: 0 });
  const [terlaris, setTerlaris] = useState([]);
  const [terbaru, setTerbaru] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: pesanan } = await supabase.from("pesanan").select("*");
      if (pesanan) {
        const revenue = pesanan.filter(p => p.status === "selesai").reduce((s, p) => s + (p.total || 0), 0);
        setStats({
          revenue,
          total: pesanan.length,
          menunggu: pesanan.filter(p => p.status === "menunggu" || p.status === "diproses").length,
          selesai: pesanan.filter(p => p.status === "selesai").length,
        });
        setTerbaru(pesanan.slice(-5).reverse());
      }
      const { data: menu } = await supabase.from("menu").select("*").order("terjual", { ascending: false }).limit(3);
      if (menu) setTerlaris(menu);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Revenue", value: formatRp(stats.revenue), icon: "$", bg: "#F97316" },
    { label: "Total Pesanan", value: stats.total, icon: "🛒", bg: "#3B82F6" },
    { label: "Menunggu", value: stats.menunggu, icon: "⏱", bg: "#EAB308" },
    { label: "Selesai", value: stats.selesai, icon: "✓", bg: "#22C55E" },
  ];

  if (loading) return <p style={{ color: "#9CA3AF", padding: 20 }}>Memuat data...</p>;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 20 }}>
        {statCards.map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", marginBottom: 12 }}>
              {c.icon}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{c.value}</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ color: "#F97316" }}>★</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Menu Terlaris</span>
          </div>
          {terlaris.length === 0
            ? <p style={{ color: "#9CA3AF", fontSize: 14 }}>Belum ada data</p>
            : terlaris.map((item, i) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#FFF7ED", borderRadius: 10, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#F97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.nama}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{formatRp(item.harga)}</div>
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#F97316", background: "#FEE2D0", padding: "2px 10px", borderRadius: 20 }}>{item.terjual || 0} terjual</span>
              </div>
            ))
          }
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ color: "#F97316" }}>🛒</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Pesanan Terbaru</span>
          </div>
          {terbaru.length === 0
            ? <p style={{ color: "#9CA3AF", fontSize: 14 }}>Belum ada pesanan</p>
            : terbaru.map(order => {
              const sc = STATUS_COLOR[order.status] || STATUS_COLOR.menunggu;
              return (
                <div key={order.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#F9FAFB", borderRadius: 10, marginBottom: 8, borderLeft: `3px solid ${sc.color}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>#{order.id} · {order.nama_pelanggan}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{order.menu}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{formatRp(order.total)}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: sc.bg, color: sc.color }}>{STATUS_LABEL[order.status] || order.status}</span>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

// ─── KELOLA MENU ─────────────────────────────────────────────────
function KelollaMenu() {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nama: "", harga: "", kategori: "", tersedia: true });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function fetchMenu() {
    setLoading(true);
    const { data } = await supabase.from("menu").select("*").order("nama");
    setMenuList(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchMenu(); }, []);

  function openAdd() {
    setForm({ nama: "", harga: "", kategori: "", tersedia: true });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(item) {
    setForm({ nama: item.nama, harga: item.harga, kategori: item.kategori || "", tersedia: item.tersedia });
    setEditId(item.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.nama || !form.harga) return alert("Nama dan harga wajib diisi!");
    setSaving(true);
    const payload = { nama: form.nama, harga: Number(form.harga), kategori: form.kategori, tersedia: form.tersedia };
    if (editId) {
      await supabase.from("menu").update(payload).eq("id", editId);
    } else {
      await supabase.from("menu").insert([{ ...payload, terjual: 0 }]);
    }
    setSaving(false);
    setShowForm(false);
    fetchMenu();
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus menu ini?")) return;
    await supabase.from("menu").delete().eq("id", id);
    fetchMenu();
  }

  async function toggleTersedia(item) {
    await supabase.from("menu").update({ tersedia: !item.tersedia }).eq("id", item.id);
    fetchMenu();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Kelola Menu</h2>
        <button onClick={openAdd} style={{ background: "#F97316", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
          + Tambah Menu
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 20, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>{editId ? "Edit Menu" : "Tambah Menu Baru"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>Nama Menu *</label>
              <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })}
                placeholder="Contoh: Kopi Susu Gula Aren"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>Harga (Rp) *</label>
              <input type="number" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })}
                placeholder="28000"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>Kategori</label>
              <input value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}
                placeholder="Kopi, Minuman, Makanan..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 20 }}>
              <input type="checkbox" id="tersedia" checked={form.tersedia} onChange={e => setForm({ ...form, tersedia: e.target.checked })} />
              <label htmlFor="tersedia" style={{ fontSize: 14, color: "#374151" }}>Tersedia</label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ background: "#F97316", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              Batal
            </button>
          </div>
        </div>
      )}

      {loading ? <p style={{ color: "#9CA3AF" }}>Memuat menu...</p> : (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {menuList.length === 0
            ? <p style={{ color: "#9CA3AF", padding: 20, textAlign: "center" }}>Belum ada menu. Klik "+ Tambah Menu" untuk mulai.</p>
            : menuList.map((item, i) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < menuList.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{item.nama}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{item.kategori || "—"} · {item.terjual || 0} terjual</div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginRight: 16 }}>{formatRp(item.harga)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => toggleTersedia(item)}
                    style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, background: item.tersedia ? "#DCFCE7" : "#F3F4F6", color: item.tersedia ? "#166534" : "#6B7280" }}>
                    {item.tersedia ? "Tersedia" : "Habis"}
                  </button>
                  <button onClick={() => openEdit(item)}
                    style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, border: "1px solid #D1D5DB", cursor: "pointer", background: "#fff", color: "#374151" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "#FEE2E2", color: "#B91C1C" }}>
                    Hapus
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ─── PESANAN ─────────────────────────────────────────────────────
function Pesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("semua");

  async function fetchPesanan() {
    setLoading(true);
    const { data } = await supabase.from("pesanan").select("*").order("created_at", { ascending: false });
    setPesanan(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchPesanan(); }, []);

  async function updateStatus(id, status) {
    await supabase.from("pesanan").update({ status }).eq("id", id);
    fetchPesanan();
  }

  const filtered = filter === "semua" ? pesanan : pesanan.filter(p => p.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Pesanan</h2>
        <button onClick={fetchPesanan} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#374151" }}>
          ↻ Refresh
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["semua", "menunggu", "diproses", "selesai"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: filter === f ? "#F97316" : "#F3F4F6", color: filter === f ? "#fff" : "#6B7280" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: "#9CA3AF" }}>Memuat pesanan...</p> : (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {filtered.length === 0
            ? <p style={{ color: "#9CA3AF", padding: 20, textAlign: "center" }}>Tidak ada pesanan.</p>
            : filtered.map((order, i) => {
              const sc = STATUS_COLOR[order.status] || STATUS_COLOR.menunggu;
              return (
                <div key={order.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #F3F4F6" : "none", borderLeft: `4px solid ${sc.color}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.id} · {order.nama_pelanggan}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{order.menu}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{new Date(order.created_at).toLocaleString("id-ID")}</div>
                  </div>
                  <div style={{ textAlign: "right", marginRight: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{formatRp(order.total)}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: sc.bg, color: sc.color }}>{STATUS_LABEL[order.status] || order.status}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {order.status === "menunggu" && (
                      <button onClick={() => updateStatus(order.id, "diproses")}
                        style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "#DBEAFE", color: "#1E40AF", fontWeight: 600 }}>
                        Proses
                      </button>
                    )}
                    {order.status === "diproses" && (
                      <button onClick={() => updateStatus(order.id, "selesai")}
                        style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "#DCFCE7", color: "#166534", fontWeight: 600 }}>
                        Selesai ✓
                      </button>
                    )}
                    {order.status === "selesai" && (
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>✓ Done</span>
                    )}
                  </div>
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "menu", label: "Kelola Menu", icon: "🍽" },
    { id: "pesanan", label: "Pesanan", icon: "🛒" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F5F1EB", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>☕</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1F2937" }}>BrewMate Admin</span>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14 }}>← Ke Toko</button>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              style={{ background: "none", border: "none", borderBottom: activeNav === item.id ? "2px solid #F97316" : "2px solid transparent", color: activeNav === item.id ? "#F97316" : "#6B7280", fontWeight: activeNav === item.id ? 600 : 400, fontSize: 14, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{item.icon}</span>{item.label}
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