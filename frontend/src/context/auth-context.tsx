"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types";

interface AuthContextValue { user: User | null; token: string | null; login(email: string, password: string): Promise<void>; register(name: string, email: string, password: string): Promise<void>; logout(): void; }
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  async function persist(auth: { token: string; user: User }) {
    localStorage.setItem("token", auth.token);
    localStorage.setItem("user", JSON.stringify(auth.user));
    setToken(auth.token);
    setUser(auth.user);
  }

  const value = useMemo(() => ({
    user,
    token,
    login: async (email: string, password: string) => persist(await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })),
    register: async (name: string, email: string, password: string) => persist(await api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) })),
    logout: () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); setToken(null); }
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
