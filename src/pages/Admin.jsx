import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDollarSign, FaShoppingCart, FaClock, FaCheck,
  FaStar, FaClipboardList, FaUsers, FaArrowLeft,
  FaPlus, FaEdit, FaTrash, FaSearch,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Helpers ──────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const STATUS_COLORS = {
  pending:     "bg-yellow-100 text-yellow-700",
  Diproses:    "bg-blue-100 text-blue-700",
  Siap:        "bg-purple-100 text-purple-700",
  Selesai:     "bg-green-100 text-green-700",
  Dibatalkan:  "bg-red-100 text-red-700",
};
const STATUS_LIST = ["pending", "Diproses", "Siap", "Selesai", "Dibatalkan"];

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ── Fetch orders ──────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch users ───────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/api/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  // ── Fetch menus ───────────────────────────────────────────
  const fetchMenus = async () => {
    try {
      const res = await fetch(`${API}/api/menus`);
      const data = await res.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchMenus();
  }, []);

  // ── Update status pesanan ─────────────────────────────────
  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  // ── Delete pesanan ────────────────────────────────────────
  const deleteOrder = async (id) => {
    if (!confirm("Hapus pesanan ini?")) return;
    try {
      await fetch(`${API}/api/orders/${id}`, { method: "DELETE" });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  // ── Stats ─────────────────────────────────────────────────
  const totalRevenue = orders.filter(o => o.status === "Selesai").reduce((s, o) => s + (o.total || 0), 0);
  const totalPesanan = orders.length;
  const menunggu = orders.filter(o => o.status === "pending").length;
  const selesai = orders.filter(o => o.status === "Selesai").length;

  // ── Menu terlaris ─────────────────────────────────────────
  const menuCount = {};
  orders.forEach(o => (o.items || []).forEach(item => {
    menuCount[item.name] = (menuCount[item.name] || 0) + (item.qty || item.quantity || 1);
  }));
  const topMenus = Object.entries(menuCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // ── Filter pesanan ────────────────────────────────────────
  const filteredOrders = orders.filter(o =>
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100">

      {/* ── HEADER ── */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white p-3 rounded-xl text-xl">☕</div>
            <h1 className="text-2xl font-bold">BrewMate Admin</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <FaArrowLeft /> Ke Toko
          </button>
        </div>

        {/* ── NAV ── */}
        <nav className="max-w-7xl mx-auto px-8 flex gap-8">
          {[
            { key: "dashboard", label: "Dashboard", icon: null },
            { key: "menu",      label: "Kelola Menu", icon: <FaClipboardList /> },
            { key: "pesanan",   label: "Pesanan",      icon: <FaShoppingCart /> },
            { key: "pengguna",  label: "Pengguna",     icon: <FaUsers /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`py-4 flex items-center gap-2 font-medium border-b-2 transition
                ${tab === key
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-600 hover:text-black"}`}
            >
              {icon}{label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── CONTENT ── */}
      <main className="max-w-7xl mx-auto p-8">

        {/* ══════════ DASHBOARD ══════════ */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<FaDollarSign />} color="bg-orange-500" value={fmt(totalRevenue)} label="Total Revenue" />
              <StatCard icon={<FaShoppingCart />} color="bg-blue-500" value={totalPesanan} label="Total Pesanan" />
              <StatCard icon={<FaClock />} color="bg-yellow-500" value={menunggu} label="Menunggu" />
              <StatCard icon={<FaCheck />} color="bg-green-500" value={selesai} label="Selesai" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Menu Terlaris */}
              <div className="bg-white border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <FaStar className="text-orange-500" />
                  <h2 className="text-xl font-semibold">Menu Terlaris</h2>
                </div>
                {topMenus.length === 0
                  ? <p className="text-gray-400">Belum ada data</p>
                  : <div className="space-y-3">
                      {topMenus.map(([name, qty], i) => (
                        <div key={name} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs flex items-center justify-center font-bold">{i + 1}</span>
                            <span className="font-medium">{name}</span>
                          </div>
                          <span className="text-gray-500 text-sm">{qty}x terjual</span>
                        </div>
                      ))}
                    </div>
                }
              </div>

              {/* Pesanan Terbaru */}
              <div className="bg-white border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <FaClipboardList className="text-orange-500" />
                  <h2 className="text-xl font-semibold">Pesanan Terbaru</h2>
                </div>
                {orders.length === 0
                  ? <p className="text-gray-400">Belum ada pesanan</p>
                  : <div className="space-y-3">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{o.customer_name}</p>
                            <p className="text-sm text-gray-400">{fmtDate(o.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{fmt(o.total)}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] || "bg-gray-100"}`}>{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            </div>
          </div>
        )}

        {/* ══════════ KELOLA MENU ══════════ */}
        {tab === "menu" && (
          <div className="bg-white border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Kelola Menu</h2>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition">
                <FaPlus /> Tambah Menu
              </button>
            </div>
            {menus.length === 0
              ? <p className="text-gray-400">Belum ada menu. Tambahkan menu pertama kamu!</p>
              : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menus.map(m => (
                    <div key={m.id} className="border rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-orange-500 font-medium">{fmt(m.price)}</p>
                        <p className="text-sm text-gray-400">{m.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                        <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ══════════ PESANAN ══════════ */}
        {tab === "pesanan" && (
          <div className="bg-white border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Daftar Pesanan</h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama / ID..."
                  className="pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>

            {loading
              ? <p className="text-gray-400">Memuat pesanan...</p>
              : filteredOrders.length === 0
                ? <p className="text-gray-400">Tidak ada pesanan ditemukan.</p>
                : <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 pr-4">ID</th>
                          <th className="pb-3 pr-4">Pelanggan</th>
                          <th className="pb-3 pr-4">Total</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3 pr-4">Waktu</th>
                          <th className="pb-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(o => (
                          <tr key={o.id} className="border-b last:border-0 hover:bg-stone-50">
                            <td className="py-3 pr-4 text-gray-400 text-xs">{o.id?.slice(0, 15)}…</td>
                            <td className="py-3 pr-4 font-medium">{o.customer_name}</td>
                            <td className="py-3 pr-4 font-semibold text-orange-600">{fmt(o.total)}</td>
                            <td className="py-3 pr-4">
                              <select
                                value={o.status}
                                onChange={e => updateStatus(o.id, e.target.value)}
                                className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS_COLORS[o.status] || "bg-gray-100"}`}
                              >
                                {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className="py-3 pr-4 text-gray-400 text-xs">{fmtDate(o.created_at)}</td>
                            <td className="py-3">
                              <button onClick={() => deleteOrder(o.id)} className="text-red-400 hover:text-red-600 transition">
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
            }
          </div>
        )}

        {/* ══════════ PENGGUNA ══════════ */}
        {tab === "pengguna" && (
          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Daftar Pengguna</h2>
            {users.length === 0
              ? <p className="text-gray-400">Belum ada pengguna terdaftar.</p>
              : <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3 pr-4">Nama</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Role</th>
                        <th className="pb-3">Bergabung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-stone-50">
                          <td className="py-3 pr-4 font-medium">{u.name}</td>
                          <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "admin" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400 text-xs">{fmtDate(u.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </div>
        )}

      </main>
    </div>
  );
}

/* ── STAT CARD ── */
function StatCard({ icon, color, value, label }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-gray-500 mt-2">{label}</p>
    </div>
  );
}
