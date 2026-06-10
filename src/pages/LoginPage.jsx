import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/authcontext";
import { Coffee, Eye, EyeOff, ArrowRight } from "lucide-react";

// Demo accounts untuk login manual
const DEMO_USERS = [
  { email: "admin@brewmate.com", password: "admin123", name: "Admin BrewMate", picture: "" },
  { email: "user@brewmate.com", password: "user123", name: "User Demo", picture: "" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleManualLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const found = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        login({ name: found.name, email: found.email, picture: found.picture });
      } else {
        setError("Email atau password salah.");
      }
      setLoading(false);
    }, 800);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await res.json();
      login({ name: profile.name, email: profile.email, picture: profile.picture });
    },
    onError: () => setError("Login Google gagal, coba lagi."),
  });

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
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100 px-8 py-10 border border-orange-50">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 shadow-lg shadow-orange-200 mb-3">
              <Coffee className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">BrewMate</h1>
            <p className="text-sm text-gray-400 mt-1">Masuk untuk melanjutkan</p>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-500 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-pulse">Masuk...</span>
              ) : (
                <>
                  Masuk <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">atau</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google Login */}
          <button
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="h-4 w-4" />
            Masuk dengan Google
          </button>

          {/* Demo hint */}
          <div className="mt-6 rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
            <p className="text-xs font-semibold text-orange-600 mb-1">Akun Demo:</p>
            <p className="text-xs text-gray-500">📧 admin@brewmate.com / admin123</p>
            <p className="text-xs text-gray-500">📧 user@brewmate.com / user123</p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
