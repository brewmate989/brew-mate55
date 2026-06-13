import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/authcontext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const ACCOUNTS = [
  { email: "admin@brewmate.com", password: "admin123", name: "Admin Brew Mate", role: "admin" },
  { email: "user@brewmate.com", password: "user123", name: "User Brew Mate", role: "user" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      const account = ACCOUNTS.find(
        (a) => a.email === email && a.password === password
      );
      if (account) {
        login({ name: account.name, email: account.email, picture: null, role: account.role });
        navigate("/");
      } else {
        setError("Email atau password salah");
      }
      setIsLoading(false);
    }, 800);
  };

  const fillDemo = (type) => {
    const account = ACCOUNTS.find((a) => a.role === type);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">

      {/* Background blur */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm mx-4"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-blue-100 px-8 py-10">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-2xl">?</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Masuk ke Brew Mate</h1>
            <p className="text-sm text-gray-500">Nikmati pengalaman kafe terbaik</p>
          </div>

          {/* Demo Accounts */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
            <p className="text-xs font-semibold text-orange-700 mb-3">Akun Demo:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="w-full flex items-center gap-2 text-left hover:bg-orange-100 rounded-xl px-2 py-1.5 transition"
              >
                <span className="text-orange-500">??</span>
                <div>
                  <p className="text-xs font-medium text-gray-700">admin@brewmate.com / admin123</p>
                  <p className="text-xs text-gray-400">Akun Admin</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("user")}
                className="w-full flex items-center gap-2 text-left hover:bg-orange-100 rounded-xl px-2 py-1.5 transition"
              >
                <span className="text-orange-500">??</span>
                <div>
                  <p className="text-xs font-medium text-gray-700">user@brewmate.com / user123</p>
                  <p className="text-xs text-gray-400">Akun User</p>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500 text-center bg-red-50 py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl py-3.5 text-sm font-semibold shadow-lg shadow-orange-200 hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </motion.button>
          </form>

          {/* Guest */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-2xl text-gray-400 text-sm hover:text-gray-600 transition mt-3"
          >
            Lanjut sebagai Tamu ?
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 Brew Mate · Semua hak dilindungi
        </p>
      </motion.div>
    </div>
  );
}
