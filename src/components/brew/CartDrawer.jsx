import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cartContext.jsx";
import { formatRupiah } from "@/lib/menuData";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold">Keranjang</h2>
                <span className="text-sm text-gray-500">({itemCount} item)</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-12 w-12 text-gray-300" />
                  <p className="text-gray-500">Keranjang Anda masih kosong</p>
                  <p className="mt-1 text-sm text-gray-400">Mulai pilih menu favorit Anda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{formatRupiah(item.price)}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="rounded-full p-2 hover:bg-red-100 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full border p-2 hover:bg-gray-100">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[24px] text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full border p-2 hover:bg-gray-100">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-semibold">{formatRupiah(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="text-2xl font-bold">{formatRupiah(total)}</span>
                </div>
                <Link to="/checkout" onClick={() => setIsOpen(false)} className="flex w-full items-center justify-center rounded-2xl bg-orange-500 px-5 py-4 font-medium text-white hover:opacity-90">
                  Checkout Sekarang
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}