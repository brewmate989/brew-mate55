import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Users,
  TrendingUp, Plus, Pencil, Trash2, X, Check, Clock,
  Package, CheckCircle, XCircle, ChevronDown, ArrowLeft,
  Coffee, Search, DollarSign, ShoppingCart, Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { orderStorage } from "@/lib/orderStorage";
import { formatRupiah } from "@/lib/menuData";
import { MENU_ITEMS as INITIAL_MENU } from "@/lib/menuData";
import { useAuth } from "@/lib/authcontext";

const MENU_STORAGE_KEY = "brewmate_menu";

function getMenu() {
  try {
    const d = localStorage.getItem(MENU_STORAGE_KEY);
    return d ? JSON.parse(d) : INITIAL_MENU;
  } catch { return INITIAL_MENU; }
}
function saveMenu(menu) {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
}

const STATUS_CONFIG = {
  pending:    { label: "Menunggu",   icon: Clock,        color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  processing: { label: "Diproses",   icon: Package,      color: "text-blue-600 bg-blue-50 border-blue-200" },
  completed:  { label: "Selesai",    icon: CheckCircle,  color: "text-green-600 bg-green-50 border-green-200" },
  cancelled:  { label: "Dibatalkan", icon: XCircle,      color: "text-red-600 bg-red-50 border-red-200" },
};

const TABS = [
  { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { id: "menu",      label: "Kelola Menu", icon: UtensilsCrossed },
  { id: "orders",    label: "Pesanan",     icon: ShoppingBag },
  { id: "users",     label: "Pengguna",    icon: Users },
];

const CATEGORIES = ["kopi", "non-kopi", "cemilan", "makanan"];
const BADGES = [null, "Favorit", "Baru", "Spesial"];

// ─── Dashboard ───────────────────────────────────────────────
function Dashboard({ orders, menu }) {
  const total    = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending  = orders.filter(o => o.status === "pending").length;
  const done     = orders.filter(o => o.status === "completed").length;

  const itemSales = {};
  orders.forEach(o => (o.items || []).forEach(i => {
    itemSales[i.name] = (itemSales[i.name] || 0) + (i.quantity || 0);
  }));
  const topItems = Object.entries(itemSales).sort((a,b) => b[1]-a[1]).slice(0,5);

  const stats = [
    { label: "Total Revenue",  value: formatRupiah(total),     icon: DollarSign,   color: "bg-orange-500" },
    { label: "Total Pesanan",  value: orders.length,           icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Menunggu",       value: pending,                 icon: Clock,        color: "bg-yellow-500" },
    { label: "Selesai",        value: done,                    icon: CheckCircle,  color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
            className="bg-white rounded-2xl p-5 border shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-orange-500" /> Menu Terlaris
          </h3>
          {topItems.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {topItems.map(([name, qty], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">{i+1}</span>
                  <span className="flex-1 text-sm text-gray-700">{name}</span>
                  <span className="text-sm font-semibold text-gray-900">{qty}x</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-orange-500" /> Pesanan Terbaru
          </h3>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada pesanan</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0,5).map(o => {
                const sc = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
                return (
                  <div key={o.id} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{o.customer_name}</p>
                      <p className="text-xs text-gray-400">{formatRupiah(o.total)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${sc.color}`}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Menu Management ─────────────────────────────────────────
function MenuTab() {
  const [menu, setMenu] = useState(getMenu());
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("semua");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = menu.filter(m =>
    (filterCat === "semua" || m.category === filterCat) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({ category: "kopi", badge: null, image: "" }); setModal({ mode: "add" }); };
  const openEdit = (item) => { setForm({ ...item }); setModal({ mode: "edit", item }); };
  const closeModal = () => { setModal(null); setForm({}); };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    let updated;
    if (modal.mode === "add") {
      updated = [{ ...form, id: Date.now(), price: Number(form.price) }, ...menu];
    } else {
      updated = menu.map(m => m.id === form.id ? { ...form, price: Number(form.price) } : m);
    }
    saveMenu(updated); setMenu(updated); closeModal();
  };

  const handleDelete = (id) => {
    const updated = menu.filter(m => m.id !== id);
    saveMenu(updated); setMenu(updated); setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari menu..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="semua">Semua Kategori</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
          <Plus className="w-4 h-4" /> Tambah Menu
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="h-36 bg-gray-100 relative">
              <img src={import.meta.env.BASE_URL + (item.image || "").slice(1)} alt={item.name}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }} />
              {item.badge && (
                <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full bg-orange-500 text-white">{item.badge}</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                <span className="text-sm font-bold text-orange-500">{formatRupiah(item.price)}</span>
              </div>
              <p className="text-xs text-gray-400 mb-1 capitalize">{item.category}</p>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs font-medium hover:bg-gray-50 transition">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteConfirm(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-medium hover:bg-red-50 transition">
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900">{modal.mode === "add" ? "Tambah Menu" : "Edit Menu"}</h3>
                <button onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              {[
                { label: "Nama", key: "name", type: "text" },
                { label: "Harga", key: "price", type: "number" },
                { label: "Deskripsi", key: "description", type: "text" },
                { label: "Notes Rasa", key: "notes", type: "text" },
                { label: "Path Gambar", key: "image", type: "text", placeholder: "/images/nama-file.png" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{f.label}</label>
                  <input type={f.type} value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder || ""}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Kategori</label>
                  <select value={form.category || "kopi"} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Badge</label>
                  <select value={form.badge || ""} onChange={e => setForm(p => ({ ...p, badge: e.target.value || null }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Tidak Ada</option>
                    {BADGES.filter(Boolean).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">Batal</button>
                <button onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition">Simpan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900">Hapus Menu?</h3>
              <p className="text-sm text-gray-500">Menu ini akan dihapus permanen.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Orders Management ────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState(orderStorage.getOrders());
  const [filterStatus, setFilterStatus] = useState("semua");
  const [search, setSearch] = useState("");

  const refresh = () => setOrders(orderStorage.getOrders());

  const handleStatus = (id, status) => {
    orderStorage.updateStatus(id, status); refresh();
  };

  const handleDelete = (id) => {
    orderStorage.deleteOrder(id); refresh();
  };

  const filtered = orders.filter(o =>
    (filterStatus === "semua" || o.status === filterStatus) &&
    (o.customer_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama pelanggan..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="semua">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            return (
              <motion.div key={order.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
                className="bg-white rounded-2xl border shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.phone} • {new Date(order.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${sc.color}`}>{sc.label}</span>
                </div>

                <div className="space-y-1 mb-3">
                  {(order.items || []).map((item, j) => (
                    <div key={j} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.quantity}x {item.name}</span>
                      <span className="text-gray-700">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-3 gap-3">
                  <span className="font-bold text-gray-900">{formatRupiah(order.total)}</span>
                  <div className="flex gap-2">
                    <select value={order.status}
                      onChange={e => handleStatus(order.id, e.target.value)}
                      className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400">
                      {Object.entries(STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={() => handleDelete(order.id)}
                      className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────
function UsersTab() {
  const orders = orderStorage.getOrders();
  const userMap = {};
  orders.forEach(o => {
    const key = o.customer_name + "|" + o.phone;
    if (!userMap[key]) userMap[key] = { name: o.customer_name, phone: o.phone, orders: 0, total: 0 };
    userMap[key].orders++;
    userMap[key].total += o.total || 0;
  });
  const users = Object.values(userMap).sort((a,b) => b.total - a.total);

  return (
    <div className="space-y-3">
      {users.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Belum ada data pengguna</p>
        </div>
      ) : (
        users.map((u, i) => (
          <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
            className="bg-white rounded-2xl border shadow-sm p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                <p className="text-xs text-gray-400">{u.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 text-sm">{formatRupiah(u.total)}</p>
              <p className="text-xs text-gray-400">{u.orders} pesanan</p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────
export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const orders = orderStorage.getOrders();
  const menu   = getMenu();

  // Guard — redirect ke home kalau bukan admin
  if (!user || user.email !== "admin@brewmate.com") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">BrewMate Admin</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft className="w-4 h-4" /> Ke Toko
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-px">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
            {tab === "dashboard" && <Dashboard orders={orders} menu={menu} />}
            {tab === "menu"      && <MenuTab />}
            {tab === "orders"    && <OrdersTab />}
            {tab === "users"     && <UsersTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}