import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("brew_user");
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

    const userData = { id: data.id, name: data.name, email: data.email, role: data.role, picture: "" };
    setUser(userData);
    localStorage.setItem("brew_user", JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("brew_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
