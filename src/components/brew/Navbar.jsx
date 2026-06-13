import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, History, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cartContext.jsx";
import { useAuth } from "@/lib/authcontext";

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur border-b shadow-sm" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-10">

        <button onClick={() => scrollTo("hero")} className="flex items-center">
          <motion.span className="text-xl font-bold text-orange-500 md:text-2xl" animate={{ scale: scrolled ? 0.9 : 1 }} transition={{ duration: 0.3 }}>
            Brew Mate
          </motion.span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <button onClick={() => scrollTo("menu")} className="text-sm font-medium text-gray-600 hover:text-black">Menu</button>
          <button onClick={() => scrollTo("tentang")} className="text-sm font-medium text-gray-600 hover:text-black">Tentang Kami</button>
          <Link to="/history" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black">
            <History className="h-4 w-4" />
            Riwayat
          </Link>

          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-800">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full border" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <button onClick={logout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <button onClick={() => setIsOpen(true)} className="relative flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            <ShoppingBag className="h-4 w-4" />
            Keranjang
            {itemCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button onClick={() => setIsOpen(true)} className="relative p-2">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t bg-white/95 backdrop-blur md:hidden"
          >
            <div className="flex flex-col gap-2 px-6 py-5">
              <button onClick={() => scrollTo("menu")} className="rounded-xl px-4 py-3 text-left text-sm hover:bg-gray-100">Menu</button>
              <button onClick={() => scrollTo("tentang")} className="rounded-xl px-4 py-3 text-left text-sm hover:bg-gray-100">Tentang Kami</button>
              <Link to="/history" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm hover:bg-gray-100">
                <History className="h-4 w-4" />
                Riwayat
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-orange-600 hover:bg-orange-50">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard Admin
                </Link>
              )}
              {user && (
                <button onClick={logout} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
