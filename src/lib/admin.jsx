
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle, Package, Trash2 } from "lucide-react";
import { orderStorage } from "@/lib/orderStorage";
import { formatRupiah } from "@/lib/menuData";
import { useAuth } from "@/lib/authcontext";

const STATUS_CONFIG = {
  pending: { label: "Menunggu", color: "text-yellow-600 bg-yellow-50", icon: Clock },
  processing: { label: "Diproses", color: "text-blue-600 bg-blue-50", icon: Package },
  completed: { label: "Selesai", color: "text-green-600 bg-green-50", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", color: "text-red-600 bg-red-50", icon: XCircle },
};

export default function Admin() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    orderStorage.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await orderStorage.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus pesanan ini?")) return;
    await orderStorage.deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const filtered = filter === "semua" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    revenue: orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.total, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Dashboard Admin</h1>
              <p className="text-xs text-gray-500">Selamat datang, {user?.name}</p>
            </div>
          </div>
          <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">👑 Admin</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Pesanan", value: stats.total, color: "bg-blue-50 text-blue-700" },
            { label: "Menunggu", value: stats.pending, color: "bg-yellow-50 text-yellow-700" },
            { label: "Selesai", value: stats.completed, color: "bg-green-50 text-green-700" },
            { label: "Total Revenue", value: formatRupiah(stats.revenue), color: "bg-orange-50 text-orange-700" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs mt-1 opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["semua", "pending", "processing", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${filter === f ? "bg-orange-500 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
            >
              {f === "semua" ? "Semua" : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Tidak ada pesanan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const Icon = status.icon;
              const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;

              return (
                <div key={order.id} className="bg-white rounded-2xl border p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{order.customer_name}</p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                      <p className="text-xs text-blue-500">{order.user_email}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${status.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                      <button onClick={() => handleDelete(order.id)} className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {(items || []).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.quantity}x {item.name}</span>
                        <span>{formatRupiah(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 flex items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                      <span>{order.order_type === "dine_in" ? `Dine In • Meja ${order.table_number}` : "Takeaway"}</span>
                      <span className="mx-2">·</span>
                      <span>{order.payment_method}</span>
                    </div>
                    <span className="font-bold text-gray-900">{formatRupiah(order.total)}</span>
                  </div>

                  {/* Update Status */}
                  <div className="flex gap-2 flex-wrap">
                    {["pending", "processing", "completed", "cancelled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleUpdateStatus(order.id, s)}
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
    </div>
  );
}
