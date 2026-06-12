import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/authcontext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ADMIN_EMAIL = "admin@brewmate.com";
const ADMIN_PASSWORD = "brewmate2024";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await res.json();
      login({
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        role: "user",
      });
      navigate("/");
    },
    onError: () => alert("Login gagal, coba lagi"),
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        login({
          name: "Admin Brew Mate",
          email: ADMIN_EMAIL,
          picture: null,
          role: "admin",
        });
        navigate("/");
      } else {
        setError("Email atau password salah");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">

      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop"
          alt="Coffee"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-3">Brew Mate</h2>
          <p className="text-white/80 text-lg">Setiap cangkir adalah perjalanan rasa yang memanjakan indera Anda.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-xl">?</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Brew Mate</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Selamat datang!</p>
            <h1 className="text-3xl font-bold text-gray-900">Masuk ke Akun</h1>
          </div>

          {/* Admin Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@brewmate.com"
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white rounded-2xl px-6 py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "Masuk sebagai Admin"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">atau masuk dengan</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <motion.button
            onClick={() => handleGoogleLogin()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-2xl px-6 py-4 text-gray-700 font-medium hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </motion.button>

          {/* Guest */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition text-sm"
          >
            Lanjut sebagai Tamu
          </button>

          <p className="text-center text-xs text-gray-400 mt-8">
            Dengan masuk, kamu menyetujui{" "}
            <span className="text-orange-500 cursor-pointer">Syarat & Ketentuan</span>{" "}
            Brew Mate
          </p>
        </motion.div>
      </div>
    </div>
  );
}
