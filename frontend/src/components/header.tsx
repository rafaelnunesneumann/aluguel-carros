"use client";

import { Car, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

const ROLE_LABELS: Record<string, string> = {
  CLIENTE: "Cliente",
  EMPRESA: "Empresa",
  BANCO: "Banco",
};

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Hide header on auth pages
  if (pathname === "/login" || pathname === "/register") return null;

  function handleLogout() {
    signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Aluguel de Carros</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium leading-none">{user.nome}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{user.login}</span>
              </div>
              <Badge variant="secondary" className="hidden sm:flex text-xs">
                {ROLE_LABELS[user.userType] ?? user.userType}
              </Badge>
            </>
          )}

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-lg"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Alternar tema</span>
            </Button>
          )}

          {user && (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-9 w-9 rounded-lg" title="Sair">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sair</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
