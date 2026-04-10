"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser, UserType } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  isCliente: boolean;
  isEmpresa: boolean;
  isBanco: boolean;
  isAgente: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function signIn(authUser: AuthUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  const isCliente = user?.userType === "CLIENTE";
  const isEmpresa = user?.userType === "EMPRESA";
  const isBanco = user?.userType === "BANCO";
  const isAgente = isEmpresa || isBanco;

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, isCliente, isEmpresa, isBanco, isAgente }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
