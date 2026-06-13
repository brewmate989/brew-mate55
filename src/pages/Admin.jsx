import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, Plus, Pencil, Trash2, X, ArrowLeft, Coffee, Search, DollarSign, ShoppingCart, Clock, CheckCircle, XCircle, Package, Star } from "lucide-react";
import { getMenu, saveMenu, MENU_ITEMS, formatRupiah, getImageUrl } from "../lib/data";
import { orderStorage } from "../lib/storage";

const STATUS = {
  pending:    { label: "Menunggu",   icon: Clock,        color: "text-yellow-600 bg-yellow-50 border border-yellow-200" },
  processing: { label: "Diproses",   icon: Package,      color: "text-blue-600 bg-blue-50 border border-blue-200" },
  completed:  { label: "Selesai",    icon: CheckCircle,  color: "text-green-600 bg-green-50 border border-green-200" },
  cancelled:  { label: "Dibatalkan", icon: XCircle,      color: "text-red-600 bg-red-50 border border-red-200" },
};

const CATS = ["kopi", "non-kopi", "cemilan", "makanan"];
const BADGES = ["Favorit", "Baru", "Spesial"];
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "orders", label: "Pesanan", icon: ShoppingBag },
  { id: "users", label: "Pengguna", icon: Users },
];

function Dashboard() {
  const orders = orderStorage.getOrders();
  const total = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === "pending").length;
  const done = orders.filter(o => o.status === "completed").length;
  const itemSales = {};
  orders.forEach(o => (o.items || []).forEach(i => { itemSales[i.name] = (itemSales[i.name] || 0) + i.quantity; }));
  const top = Object.entries(itemSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenue", value: formatRupiah(total), icon: DollarSign, color: "bg-orange-500" },
          { label: "Total Pesanan", value: orders.length, icon: ShoppingCart, color: "bg-blue-500" },
          { label: "Menunggu", value: pending, icon: Clock, color: "bg-yellow-500" },
          { label: "Selesai", value: done, icon: CheckCircle, color: "bg-green-500" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
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
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-orange-500" />Menu Terlaris</h3>
          {top.length === 0 ? <p className="text-sm text-gray-400">Belum ada data</p> : (
            <div className="space-y-3">
              {top.map(([name, qty], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm text-gray-700">{name}</span>
                  <span className="text-sm font-semibold">{qty}x</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-orange-500" />Pesanan Terbaru</h3>
          {orders.length === 0 ? <p className="text-sm text-gray-400">Belum ada pesanan</p> : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(o => {
                const s = STATUS[o.status] || STATUS.pending;
                return (
                  <div key={o.id} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{o.customer_name}</p>
                      <p className="text-xs text-gray-400">{formatRupiah(o.total)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${s.color}`}>{s.label}</span>
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

function MenuTab() {
  const [menu, setMenu] = useState(getMenu());
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("semua");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [del, setDel] = useState(null);

  const filtered = menu.filter(m => (cat === "semua" || m.category === cat) && m.name.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if (!form.name || !form.price) return;
    const updated = modal === "add"
      ? [{ ...form, id: Date.now(), price: Number(form.price) }, ...menu]
      : menu.map(m => m.id === form.id ? { ...form, price: Number(form.price) } : m);
    saveMenu(updated); setMenu(updated); setModal(null); setForm({});
  };

  const remove = (id) => { const u = menu.filter(m => m.id !== id); saveMenu(u); setMenu(u); setDel(null); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari menu..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="semua">Semua</option>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => { setForm({ category: "kopi", badge: null, image: "" }); setModal("add"); }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="h-32 bg-gray-100 relative">
              <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover"
                onError={e => { e.target.src = "https://placehold.co/400x300/f97316/white?text=" + encodeURIComponent(item.name); }} />
              {item.badge && <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full bg-orange-500 text-white">{item.badge}</span>}
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-1">
                <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                <span className="text-sm font-bold text-orange-500">{formatRupiah(item.price)}</span>
              </div>
              <p className="text-xs text-gray-400 capitalize mb-3">{item.category}</p>
              <div className="flex gap-2">
                <button onClick={() => { setForm({ ...item }); setModal("edit"); }}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border text-xs font-medium hover:bg-gray-50">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDel(item.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-medium hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{modal === "add" ? "Tambah Menu" : "Edit Menu"}</h3>
                <button onClick={() => { setModal(null); setForm({}); }}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              {[["Nama", "name", "text"], ["Harga", "price", "number"], ["Deskripsi", "description", "text"], ["Notes Rasa", "notes", "text"], ["File Gambar", "image", "text"]].map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</label>
                  <input type={type} value={form[key] || ""} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={key === "image" ? "nama-file.png" : ""}
                    className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Kategori</label>
                  <select value={form.category || "kopi"} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Badge</label>
                  <select value={form.badge || ""} onChange={e => setForm(p => ({ ...p, badge: e.target.value || null }))}
                    className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Tidak Ada</option>
                    {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setModal(null); setForm({}); }} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-gray-50">Batal</button>
                <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600">Simpan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {del && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6 text-red-500" /></div>
              <h3 className="font-bold text-gray-900">Hapus Menu?</h3>
              <div className="flex gap-3">
                <button onClick={() => setDel(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Batal</button>
                <button onClick={() => remove(del)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold">Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState(orderStorage.getOrders());
  const [filter, setFilter] = useState("semua");
  const [search, setSearch] = useState("");

  const refresh = () => setOrders(orderStorage.getOrders());
  const filtered = orders.filter(o => (filter === "semua" || o.status === filter) && (o.customer_name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pelanggan..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="semua">Semua Status</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      <div className="space-y-3">
        {filtered.map((order, i) => {
          const s = STATUS[order.status] || STATUS.pending;
          return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{order.customer_name}</p>
                  <p className="text-xs text-gray-400">{order.phone} • {new Date(order.created_at).toLocaleString("id-ID")}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${s.color}`}>{s.label}</span>
              </div>
              <div className="space-y-1 mb-3">
                {order.items.map((item, j) => (
                  <div key={j} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.quantity}x {item.name}</span>
                    <span>{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-bold text-gray-900">{formatRupiah(order.total)}</span>
                <div className="flex gap-2">
                  <select value={order.status} onChange={e => { orderStorage.updateStatus(order.id, e.target.value); refresh(); }}
                    className="text-xs rounded-lg border px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <button onClick={() => { orderStorage.deleteOrder(order.id); refresh(); }}
                    className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function UsersTab() {
  const orders = orderStorage.getOrders();
  const map = {};
  orders.forEach(o => {
    const k = o.customer_name + "|" + o.phone;
    if (!map[k]) map[k] = { name: o.customer_name, phone: o.phone, orders: 0, total: 0 };
    map[k].orders++; map[k].total += o.total || 0;
  });
  const users = Object.values(map).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-3">
      {users.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="text-sm">Belum ada data</p></div>
      ) : users.map((u, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          className="bg-white rounded-2xl border shadow-sm p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">{u.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{u.name}</p>
              <p className="text-xs text-gray-400">{u.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">{formatRupiah(u.total)}</p>
            <p className="text-xs text-gray-400">{u.orders} pesanan</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center"><Coffee className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft className="w-4 h-4" /> Ke Toko
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${tab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === "dashboard" && <Dashboard />}
            {tab === "menu" && <MenuTab />}
            {tab === "orders" && <OrdersTab />}
            {tab === "users" && <UsersTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}