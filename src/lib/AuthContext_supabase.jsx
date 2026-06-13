import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // sessionStorage = per tab, tidak dishare antar tab
    const saved = sessionStorage.getItem("brew_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const loginWithCredentials = async (email, password) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) return { success: false, error: "Email atau password salah." };

    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      picture: "",
    };

    setUser(userData);
    sessionStorage.setItem("brew_user", JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("brew_user");
  };

  const isAdmin = user?.role === "admin" || user?.email === "admin@brewmate.com";

  return (
    <AuthContext.Provider value={{ user, loading, loginWithCredentials, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}