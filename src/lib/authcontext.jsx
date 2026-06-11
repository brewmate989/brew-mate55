import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

// Email yang dianggap admin
const ADMIN_EMAILS = [
  "matebrew0@gmail.com",
  "admin@brewmate.com",
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("brew_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem("brew_user");
    }
    setLoading(false);
  }, []);

  // Login manual (email + password)
  const loginWithCredentials = async (email, password) => {
    const DEMO_USERS = [
      { email: "admin@brewmate.com", password: "admin123", name: "Admin BrewMate", picture: "" },
      { email: "user@brewmate.com",  password: "user123",  name: "User Demo",      picture: "" },
    ];

    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return { success: false, error: "Email atau password salah." };

    const userData = {
      id:      found.email,
      name:    found.name,
      email:   found.email,
      picture: found.picture,
      role:    ADMIN_EMAILS.includes(found.email) ? "admin" : "user",
    };

    setUser(userData);
    localStorage.setItem("brew_user", JSON.stringify(userData));
    return { success: true };
  };

  // Login Google (dipanggil setelah dapat profile dari Google)
  const login = (profile) => {
    const userData = {
      id:      profile.email,
      name:    profile.name,
      email:   profile.email,
      picture: profile.picture || "",
      role:    ADMIN_EMAILS.includes(profile.email) ? "admin" : "user",
    };

    setUser(userData);
    localStorage.setItem("brew_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("brew_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}