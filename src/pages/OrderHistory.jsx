import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { orderStorage } from "@/lib/orderStorage";
import { formatRupiah } from "@/lib/menuData";
import { useAuth } from "@/lib/authcontext";

const STATUS_CONFIG = {
  pending: { label: "Menunggu", icon: Clock, color: "text-yellow-600 bg-yellow-50" },
  processing: { label: "Diproses", icon: Package, color: "text-blue-600 bg-blue-50" },
  completed: { label: "Selesai", icon: CheckCircle, color: "text-green-600 bg-green-50" },
  cancelled: { label: "Dibatalkan", icon: XCircle, color: "text-red-600 bg-red-50" },
};

export default function OrderHistory() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (isAdmin) {
        const data = await orderStorage.getOrders();
        setOrders(data);
      } else {
        const data = await orderStorage.getOrdersByUser(user?.email || "guest");
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Belum Ada Pesanan</h2>
          <p className="text-muted-foreground mb-6">Riwayat pesanan akan muncul di sini</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b sticky top-0 z-40 bg-background">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">
              {isAdmin ? "Semua Pesanan (Admin)" : "Riwayat Pesanan"}
            </h1>
            {isAdmin && (
              <p className="text-xs text-muted-foreground">{orders.length} total pesanan</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        {orders.map((order) => {
          const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
          const Icon = status.icon;
          const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;

          return (
            <div key={order.id} className="border rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                  {isAdmin && (
                    <p className="text-xs text-blue-500 mt-0.5">{order.user_email}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${status.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {status.label}
                </span>
              </div>

              <div className="space-y-1.5">
                {(items || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                    <span>{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>{order.order_type === "dine_in" ? `Dine In • Meja ${order.table_number}` : "Takeaway"}</p>
                  <p>Bayar via <span className="font-medium text-foreground">{order.payment_method}</span></p>
                </div>
                <span className="font-bold">{formatRupiah(order.total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
