import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, CheckCircle, Banknote, Wallet, QrCode, CreditCard, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cartContext.jsx";
import { formatRupiah } from "@/lib/menuData";
import { orderStorage } from "@/lib/orderStorage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PAYMENT_METHODS = [
  { id: "cash", label: "Tunai / Cash", icon: Banknote, desc: "Bayar langsung di kasir" },
  { id: "qris", label: "QRIS", icon: QrCode, desc: "Scan QR untuk bayar" },
  { id: "transfer", label: "Transfer Bank", icon: CreditCard, desc: "BCA / Mandiri / BNI / BRI" },
  { id: "ewallet", label: "E-Wallet", icon: Wallet, desc: "GoPay / OVO / Dana" },
];

const BANK_ACCOUNTS = [
  { bank: "BCA", number: "1234567890", name: "Brew Mate" },
  { bank: "Mandiri", number: "0987654321", name: "Brew Mate" },
  { bank: "BNI", number: "1122334455", name: "Brew Mate" },
];

const EWALLET_ACCOUNTS = [
  { name: "GoPay", number: "0812-3456-7890" },
  { name: "OVO", number: "0812-3456-7890" },
  { name: "Dana", number: "0812-3456-7890" },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
    </button>
  );
}

function PaymentDetail({ method, total }) {
  if (method === "cash") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Banknote className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-semibold text-green-800">Bayar di Kasir</h3>
        <p className="text-sm text-green-700">Tunjukkan pesanan ini ke kasir dan bayar tunai sebesar</p>
        <p className="text-2xl font-bold text-green-800">{formatRupiah(total)}</p>
      </div>
    );
  }

  if (method === "qris") {
    return (
      <div className="rounded-2xl border p-5 text-center space-y-4">
        <h3 className="font-semibold">Scan QRIS</h3>
        <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center p-3">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=BrewMate-Payment"
            alt="QRIS"
            className="w-full h-full rounded-xl"
          />
        </div>
        <p className="text-sm text-muted-foreground">Scan QR di atas menggunakan aplikasi pembayaran apapun</p>
        <div className="bg-orange-50 rounded-xl px-4 py-2">
          <p className="text-sm text-orange-700">Total: <span className="font-bold">{formatRupiah(total)}</span></p>
        </div>
      </div>
    );
  }

  if (method === "transfer") {
    return (
      <div className="rounded-2xl border p-5 space-y-4">
        <h3 className="font-semibold">Transfer Bank</h3>
        <p className="text-sm text-muted-foreground">Transfer ke salah satu rekening berikut:</p>
        <div className="space-y-3">
          {BANK_ACCOUNTS.map((acc) => (
            <div key={acc.bank} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground">{acc.bank}</p>
                <p className="font-mono font-semibold">{acc.number}</p>
                <p className="text-xs text-muted-foreground">a.n {acc.name}</p>
              </div>
              <CopyButton text={acc.number} />
            </div>
          ))}
        </div>
        <div className="bg-orange-50 rounded-xl px-4 py-2 flex justify-between items-center">
          <p className="text-sm text-orange-700">Total Transfer</p>
          <p className="font-bold text-orange-800">{formatRupiah(total)}</p>
        </div>
      </div>
    );
  }

  if (method === "ewallet") {
    return (
      <div className="rounded-2xl border p-5 space-y-4">
        <h3 className="font-semibold">E-Wallet</h3>
        <p className="text-sm text-muted-foreground">Kirim ke salah satu nomor berikut:</p>
        <div className="space-y-3">
          {EWALLET_ACCOUNTS.map((acc) => (
            <div key={acc.name} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground">{acc.name}</p>
                <p className="font-mono font-semibold">{acc.number}</p>
              </div>
              <CopyButton text={acc.number} />
            </div>
          ))}
        </div>
        <div className="bg-orange-50 rounded-xl px-4 py-2 flex justify-between items-center">
          <p className="text-sm text-orange-700">Total</p>
          <p className="font-bold text-orange-800">{formatRupiah(total)}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function Checkout() {
  const { items, total, clearCart, itemCount } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    order_type: "dine_in",
    table_number: "",
    notes: "",
    payment_method: "cash",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      orderStorage.createOrder({
        ...form,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        })),
        total,
      });
      setShowPaymentDetail(true);
    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = () => {
    setOrderSuccess(true);
    clearCart();
  };

  if (items.length === 0 && !orderSuccess && !showPaymentDetail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Keranjang Kosong</h2>
          <p className="text-muted-foreground mb-6">Belum ada item di keranjang</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Pembayaran Dikonfirmasi!</h2>
          <p className="text-muted-foreground mb-2">Terima kasih, {form.customer_name}</p>
          <p className="text-sm text-muted-foreground mb-8">Pesanan kamu sedang diproses oleh kasir</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl">
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  if (showPaymentDetail) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b sticky top-0 z-40 bg-background">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={() => setShowPaymentDetail(false)} className="p-2 rounded-full hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Detail Pembayaran</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
          <PaymentDetail method={form.payment_method} total={total} />
          <button
            onClick={handleConfirmPayment}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Konfirmasi Pembayaran
          </button>
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
          <h1 className="text-xl font-semibold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <h2 className="text-lg font-semibold">Detail Pesanan</h2>

            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" required value={form.customer_name} onChange={(e) => handleChange("customer_name", e.target.value)} placeholder="Masukkan nama" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" type="tel" required value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="0812xxxx" className="mt-2" />
            </div>

            <div>
              <Label className="mb-3 block">Tipe Pesanan</Label>
              <RadioGroup value={form.order_type} onValueChange={(value) => handleChange("order_type", value)} className="grid grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${form.order_type === "dine_in" ? "border-primary bg-primary/5" : ""}`}>
                  <RadioGroupItem value="dine_in" />
                  <span>Dine In</span>
                </label>
                <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${form.order_type === "takeaway" ? "border-primary bg-primary/5" : ""}`}>
                  <RadioGroupItem value="takeaway" />
                  <span>Takeaway</span>
                </label>
              </RadioGroup>
            </div>

            {form.order_type === "dine_in" && (
              <div>
                <Label htmlFor="table">Nomor Meja</Label>
                <Input id="table" value={form.table_number} onChange={(e) => handleChange("table_number", e.target.value)} placeholder="Contoh: A1" className="mt-2" />
              </div>
            )}

            <div>
              <Label className="mb-3 block">Metode Pembayaran</Label>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = form.payment_method === method.id;
                  return (
                    <button key={method.id} type="button" onClick={() => handleChange("payment_method", method.id)}
                      className={`flex items-center gap-3 border rounded-xl p-4 text-left transition-all ${isSelected ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-sm font-medium">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Contoh: tanpa pedas" className="mt-2" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
              {isSubmitting ? "Memproses..." : `Lanjut ke Pembayaran • ${formatRupiah(total)}`}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="border rounded-2xl p-5 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan ({itemCount})</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded">{item.quantity}x</span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
