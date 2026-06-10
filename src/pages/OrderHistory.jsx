import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { orderStorage } from "@/lib/orderStorage";
import { formatRupiah } from "@/lib/menuData";

const STATUS_CONFIG = {
  pending:    { label: "Menunggu",   icon: Clock,        color: "text-yellow-600 bg-yellow-50 border border-yellow-200" },
  processing: { label: "Diproses",   icon: Package,      color: "text-blue-600 bg-blue-50 border border-blue-200" },
  completed:  { label: "Selesai",    icon: CheckCircle,  color: "text-green-600 bg-green-50 border border-green-200" },
  cancelled:  { label: "Dibatalkan", icon: XCircle,      color: "text-red-600 bg-red-50 border border-red-200" },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [confirmCancel, setConfirmCancel] = useState(null);

  useEffect(() => {
    try {
      const data = orderStorage?.getOrders?.() || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      setOrders([]);
    }
  }, []);

  const handleCancel = (orderId) => {
    orderStorage.updateStatus(orderId, "cancelled");
    setOrders(orderStorage.getOrders());
    setConfirmCancel(null);
  };

  const canCancel = (status) => status === "pending" || status === "processing";

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Belum Ada Pesanan</h2>
          <p className="text-muted-foreground mb-6">Riwayat pesanan kamu akan muncul di sini</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 z-40 bg-background">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">Riwayat Pesanan</h1>
        </div>
      </div>

      {/* List */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        {orders.map((order, index) => {
          const status = STATUS_CONFIG[order?.status] || STATUS_CONFIG.pending;
          const Icon = status.icon;

          return (
            <motion.div key={order?.id || index}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              className="border rounded-2xl p-5 space-y-4 bg-white">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{order?.customer_name || "Pelanggan"}</p>
                  <p className="text-sm text-muted-foreground">{order?.phone || "-"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order?.created_at ? new Date(order.created_at).toLocaleString("id-ID") : "-"}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${status.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {status.label}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-1.5">
                {(order?.items || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item?.quantity || 0}x {item?.name || "Produk"}</span>
                    <span>{formatRupiah((item?.price || 0) * (item?.quantity || 0))}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {order?.order_type === "dine_in" ? `Dine In • Meja ${order?.table_number || "-"}` : "Takeaway"}
                </span>
                <span className="font-bold">{formatRupiah(order?.total || 0)}</span>
              </div>

              {/* Cancel Button */}
              {canCancel(order?.status) && (
                <button onClick={() => setConfirmCancel(order.id)}
                  className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition">
                  Batalkan Pesanan
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Confirm Cancel Modal */}
      <AnimatePresence>
        {confirmCancel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900">Batalkan Pesanan?</h3>
              <p className="text-sm text-gray-500">Pesanan yang dibatalkan tidak dapat dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmCancel(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">
                  Tidak
                </button>
                <button onClick={() => handleCancel(confirmCancel)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
                  Ya, Batalkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}