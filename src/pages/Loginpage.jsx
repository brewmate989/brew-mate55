import React, { useState } from "react";
import { useAuth } from "@/lib/authcontext";

const DEMO_ACCOUNTS = [
  { email: "admin@brewmate.com", password: "admin123", role: "admin", name: "Admin BrewMate" },
  { email: "user@brewmate.com",  password: "user123",  role: "user",  name: "User BrewMate" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user); // pakai AuthContext, bukan window.location
        return;
      }
    } catch {
      // Backend tidak tersedia, pakai mode demo
    }

    // Mode demo / fallback
    const found = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );

    if (!found) {
      setError("Email atau password salah");
      setLoading(false);
      return;
    }

    login({
      id: found.role === "admin" ? 1 : 2,
      name: found.name,
      email: found.email,
      role: found.role,
      picture: "",
    });
  };

  const loginAs = (type) => {
    const acc = DEMO_ACCOUNTS.find(a => a.role === type);
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">☕</div>
          <h1 className="text-2xl font-semibold">BrewMate</h1>
          <p className="text-gray-400 text-sm mt-1">Masuk ke akun kamu</p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Login"}
          </button>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-400 text-center mb-3">Akun Demo</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => loginAs("admin")}
              className="text-xs py-2 px-3 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition"
            >
              👑 Login Admin
            </button>
            <button
              onClick={() => loginAs("user")}
              className="text-xs py-2 px-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
            >
              👤 Login User
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-400 space-y-1">
            <p>Admin: admin@brewmate.com / admin123</p>
            <p>User: user@brewmate.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}