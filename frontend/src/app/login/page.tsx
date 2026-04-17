"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import LoginForm from "@/components/auth/login-form";
import { Car, Shield, Zap } from "lucide-react";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — hero ── */}
      <div
        className="hidden lg:flex lg:flex-[3] relative overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/80" />

        {/* Speed lines overlay */}
        <div className="absolute inset-0 bg-speed-lines opacity-60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Top — brand */}
          <div className="flex items-center gap-3 animate-speed-enter">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary animate-glow-pulse">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-white text-2xl font-bold tracking-widest uppercase">
              AutoDrive
            </span>
          </div>

          {/* Bottom — tagline */}
          <div className="space-y-6">
            <div className="divider-red w-16 animate-hero-fade" />
            <h1 className="font-heading text-5xl font-bold text-white leading-tight animate-hero-fade animation-delay-100">
              Dirija com
              <br />
              <span className="text-primary">Excelência.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-sm animate-hero-fade animation-delay-200">
              Veículos premium disponíveis para aluguel. Gestão completa da sua frota em um único lugar.
            </p>

            <div className="flex gap-8 pt-2 animate-hero-fade animation-delay-300">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Segurado</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Car className="h-4 w-4 text-primary" />
                <span>Frota Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center bg-background p-8 min-h-screen">
        <div className="w-full max-w-sm animate-card-enter">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-widest uppercase">AutoDrive</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
