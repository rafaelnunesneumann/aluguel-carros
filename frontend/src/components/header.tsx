"use client";

import { Car, Moon, Sun, LogOut, Gauge } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const ROLE_LABELS: Record<string, string> = {
  CLIENTE: "Cliente",
  EMPRESA: "Empresa",
  BANCO: "Banco",
};

const ROLE_COLORS: Record<string, string> = {
  CLIENTE: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  EMPRESA: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  BANCO: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  if (pathname === "/login" || pathname === "/register") return null;

  function handleLogout() {
    signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      {/* Red accent line at top */}
      <div className="h-[2px] bg-gradient-to-r from-primary via-primary/70 to-transparent" />

      <div className="container mx-auto flex h-15 items-center justify-between px-4 max-w-7xl py-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30 animate-glow-pulse">
            <Car className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-widest uppercase leading-none text-foreground">
              AutoDrive
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase leading-none mt-0.5">
              Sistema de Gestão
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              {/* User info */}
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-sm font-semibold leading-none">{user.nome}</span>
                <span className="text-xs text-muted-foreground mt-0.5 leading-none">{user.login}</span>
              </div>

              {/* Role badge */}
              <span
                className={`hidden sm:inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wider uppercase ${ROLE_COLORS[user.userType] ?? "bg-secondary text-secondary-foreground border-border"}`}
              >
                {ROLE_LABELS[user.userType] ?? user.userType}
              </span>
            </>
          )}

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-lg hover:bg-accent hover:text-accent-foreground"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
          )}

          {/* Logout */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sair</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
