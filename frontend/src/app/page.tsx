"use client";

import { useAuth } from "@/contexts/auth-context";
import { ClienteDashboard } from "@/components/dashboard/cliente-dashboard";
import { AgenteDashboard } from "@/components/dashboard/agente-dashboard";
import { LandingPage } from "@/components/landing-page";
import { Header } from "@/components/header";
import { Car } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-slow" />
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{ animationDuration: "1s" }} />
            <Car className="absolute inset-0 m-auto h-7 w-7 text-primary" />
          </div>
          <p className="font-heading text-sm tracking-widest uppercase text-muted-foreground animate-pulse">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <LandingPage />;

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
