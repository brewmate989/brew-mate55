import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authcontext";
import { Coffee, Eye, EyeOff, ArrowRight, UserPlus, LogIn } from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function LoginPage() {
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // login | register

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState({
    login: false,
    register: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading((prev) => ({ ...prev, login: true }));

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login gagal");

      login(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Password dan konfirmasi password tidak cocok");
    }

    setLoading((prev) => ({ ...prev, register: true }));

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registrasi gagal");

      login(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, register: false }));
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setShowPassword(false);
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const isLogin = mode === "login";
  const isLoading = loading.login || loading.register;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdf6ee] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-orange-200 opacity-30 blur-3xl" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-amber-300 opacity-25 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100 px-8 py-10 border border-orange-50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 shadow-lg shadow-orange-200 mb-3">
              <Coffee className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">BrewMate</h1>
            <p className="text-sm text-gray-400 mt-1">
              {isLogin ? "Masuk untuk melanjutkan" : "Buat akun baru"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
                isLogin
                  ? "bg-white shadow text-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </button>

            <button
              onClick={() => switchMode("register")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-white shadow text-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Daftar
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={isLogin ? handleLogin : handleRegister}
              className="space-y-4"
            >
              {/* Name */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama kamu"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="kamu@email.com"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                    Konfirmasi Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                  />
                </div>
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="animate-pulse">
                    {isLogin ? "Masuk..." : "Mendaftar..."}
                  </span>
                ) : (
                  <>
                    {isLogin ? "Masuk" : "Buat Akun"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2024 BrewMate. Semua hak dilindungi.
        </p>
      </motion.div>
    </div>
  );
}