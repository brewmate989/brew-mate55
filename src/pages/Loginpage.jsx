import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authcontext";
import {
  Coffee,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  LogIn,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    setTimeout(() => {
      if (!form.email || !form.password) {
        setError("Email dan password wajib diisi");
        setLoading(false);
        return;
      }

      login({
        id: Date.now(),
        name: form.email.split("@")[0],
        email: form.email,
        role:
          form.email === "admin@brewmate.com"
            ? "admin"
            : "customer",
      });

      setLoading(false);
    }, 500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      login({
        id: Date.now(),
        name: form.name,
        email: form.email,
        role: "customer",
      });

      setLoading(false);
    }, 500);
  };

  const handleDemoUser = () => {
    login({
      id: "demo-user",
      name: "Demo User",
      email: "demo@brewmate.com",
      role: "customer",
    });
  };

  const handleDemoAdmin = () => {
    login({
      id: "demo-admin",
      name: "Demo Admin",
      email: "admin@brewmate.com",
      role: "admin",
    });
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdf6ee] relative overflow-hidden">
      <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-orange-200 opacity-30 blur-3xl" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-amber-300 opacity-25 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100 px-8 py-10 border border-orange-50">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 shadow-lg shadow-orange-200 mb-3">
              <Coffee className="text-white w-7 h-7" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              BrewMate
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              {mode === "login"
                ? "Masuk untuk melanjutkan"
                : "Buat akun baru"}
            </p>
          </div>

          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-white shadow text-orange-500"
                  : "text-gray-500"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </button>

            <button
              onClick={() => switchMode("register")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                mode === "register"
                  ? "bg-white shadow text-orange-500"
                  : "text-gray-500"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Daftar
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={
                mode === "login"
                  ? handleLogin
                  : handleRegister
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {mode === "register" && (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                />
              )}

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              />

              <div className="relative">
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {mode === "register" && (
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Konfirmasi Password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                />
              )}

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">
                  {error}
                </p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-white font-semibold hover:bg-orange-600 transition"
              >
                {loading
                  ? "Memproses..."
                  : mode === "login"
                  ? "Masuk"
                  : "Daftar"}

                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {mode === "login" && (
                <>
                  <button
                    type="button"
                    onClick={handleDemoUser}
                    className="w-full rounded-xl border border-gray-200 py-3 text-sm font-medium hover:bg-gray-50"
                  >
                    Masuk Demo User
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoAdmin}
                    className="w-full rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-medium text-orange-600 hover:bg-orange-100"
                  >
                    Masuk Demo Admin
                  </button>
                </>
              )}
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 BrewMate
        </p>
      </motion.div>
    </div>
  );
}