import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Users,
  ArrowLeft, Clock, CheckCircle, XCircle, Package, Trash2,
  DollarSign, Star, Coffee
} from "lucide-react";
import { orderStorage } from "@/lib/orderStorage";
import { formatRupiah, MENU_ITEMS } from "@/lib/menuData";
import { useAuth } from "@/lib/authcontext";

const STATUS_CONFIG = {
  pending:    { label: "Menunggu",   color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  processing: { label: "Diproses",   color: "text-blue-600 bg-blue-50 border-blue-200",       icon: Package },
  completed:  { label: "Selesai",    color: "text-green-600 bg-green-50 border-green-200",    icon: CheckCircle },
  cancelled:  { label: "Dibatalkan", color: "text-red-600 bg-red-50 border-red-200",          icon: XCircle },
};

// ── Tab: Dashboard ────────────────────────────────────────────
function TabDashboard({ orders }) {
  const stats = {
    revenue:  orders.filter(o => o.status === "completed").reduce((s, o) => s + o.total, 0),
    total:    orders.length,
    pending:  orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
  };

  // Menu terlaris
  const itemCount = {};
  orders.forEach(order => {
    const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
    items.forEach(item => {
      itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
    });
  });
  const topMenus = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const statCards = [
    { label: "Total Revenue",  value: formatRupiah(stats.revenue),  icon: DollarSign, iconBg: "bg-orange-500" },
    { label: "Total Pesanan",  value: stats.total,                  icon: ShoppingBag, iconBg: "bg-blue-500" },
    { label: "Menunggu",       value: stats.pending,                icon: Clock,       iconBg: "bg-yellow-500" },
    { label: "Selesai",        value: stats.completed,              icon: CheckCircle, iconBg: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Menu Terlaris */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-gray-800">Menu Terlaris</h3>
          </div>
          {topMenus.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {topMenus.map(([name, qty], i) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm text-gray-700">{name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{qty}x</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pesanan Terbaru */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-gray-800">Pesanan Terbaru</h3>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada pesanan</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                return (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatRupiah(order.total)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                    </div>
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

// ── Tab: Kelola Menu ──────────────────────────────────────────
function TabMenu() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b">
        <h3 className="font-semibold text-gray-800">Daftar Menu</h3>
        <p className="text-sm text-gray-400 mt-1">{MENU_ITEMS.length} item tersedia</p>
      </div>
      <div className="divide-y">
        {MENU_ITEMS.map(item => (
          <div key={item.id} className="flex items-center gap-4 px-5 py-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center overflow-hidden shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display="none"; }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 truncate">{item.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-gray-900">{formatRupiah(item.price)}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 capitalize">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Pesanan ──────────────────────────────────────────────
function TabPesanan({ orders, onUpdateStatus, onDelete }) {
  const [filter, setFilter] = useState("semua");
  const filtered = filter === "semua" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["semua", "pending", "processing", "completed", "cancelled"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${filter === f ? "bg-orange-500 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
          >
            {f === "semua" ? "Semua" : STATUS_CONFIG[f]?.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{order.customer_name}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${cfg.color}`}>
                      <Icon className="w-3.5 h-3.5" />{cfg.label}
                    </span>
                    <button onClick={() => onDelete(order.id)} className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.quantity}x {item.name}</span>
                      <span>{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {order.order_type === "dine_in" ? `Dine In · Meja ${order.table_number}` : "Takeaway"}
                    {" · "}{order.payment_method}
                  </span>
                  <span className="font-bold text-gray-900">{formatRupiah(order.total)}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {["pending", "processing", "completed", "cancelled"].map(s => (
                    <button
                      key={s}
                      onClick={() => onUpdateStatus(order.id, s)}
                      disabled={order.status === s}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${order.status === s ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50 text-gray-600"}`}
                    >
                      {STATUS_CONFIG[s]?.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Tab: Pengguna ─────────────────────────────────────────────
function TabPengguna({ orders }) {
  // Kumpulkan user unik dari orders
  const usersMap = {};
  orders.forEach(o => {
    const key = o.user_email || o.customer_name;
    if (!usersMap[key]) {
      usersMap[key] = { name: o.customer_name, email: o.user_email || "-", orders: 0, total: 0 };
    }
    usersMap[key].orders += 1;
    usersMap[key].total += o.total;
  });
  const users = Object.values(usersMap);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b">
        <h3 className="font-semibold text-gray-800">Data Pengguna</h3>
        <p className="text-sm text-gray-400 mt-1">{users.length} pengguna terdaftar dari pesanan</p>
      </div>
      {users.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada data pengguna</p>
        </div>
      ) : (
        <div className="divide-y">
          {users.map((u, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <span className="text-orange-600 font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{u.name}</p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-gray-900">{u.orders} pesanan</p>
                <p className="text-xs text-gray-400">{formatRupiah(u.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main AdminPage ────────────────────────────────────────────
export default function AdminPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const data = orderStorage.getOrders();
    if (data instanceof Promise) {
      data.then(d => { setOrders(d); setLoading(false); });
    } else {
      setOrders(data);
      setLoading(false);
    }
  }, []);

  const handleUpdateStatus = (id, status) => {
    orderStorage.updateStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus pesanan ini?")) return;
    orderStorage.deleteOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard",   icon: LayoutDashboard },
    { id: "menu",      label: "Kelola Menu", icon: UtensilsCrossed },
    { id: "pesanan",   label: "Pesanan",     icon: ShoppingBag },
    { id: "pengguna",  label: "Pengguna",    icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">BrewMate Admin</span>
            </div>
            <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
              <ArrowLeft className="w-4 h-4" />
              Ke Toko
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                    isActive
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === "dashboard" && <TabDashboard orders={orders} />}
        {activeTab === "menu"      && <TabMenu />}
        {activeTab === "pesanan"   && <TabPesanan orders={orders} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />}
        {activeTab === "pengguna"  && <TabPengguna orders={orders} />}
      </div>
    </div>
  );
}