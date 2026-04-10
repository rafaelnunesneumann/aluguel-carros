"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { useAuth } from "@/contexts/auth-context";
import { ClienteDashboard } from "@/components/dashboard/cliente-dashboard";
import { AgenteDashboard } from "@/components/dashboard/agente-dashboard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {user.userType === "CLIENTE" ? (
            <ClienteDashboard />
          ) : (
            <AgenteDashboard />
          )}
        </div>
      </main>
    </div>
  );
}
