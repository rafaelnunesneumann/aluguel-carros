"use client";

import { useState } from "react";
import RegisterClienteForm from "@/components/auth/register-cliente-form";
import RegisterAgenteForm from "@/components/auth/register-agente-form";
import { Button } from "@/components/ui/button";
import { Car, Building2, User } from "lucide-react";
import Link from "next/link";

type Step = "choice" | "cliente" | "agente";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("choice");

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — hero ── */}
      <div
        className="hidden lg:flex lg:flex-[2] relative overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/80" />
        <div className="absolute inset-0 bg-speed-lines opacity-50" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <div className="flex items-center gap-3 animate-speed-enter">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary animate-glow-pulse">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-white text-2xl font-bold tracking-widest uppercase">
              AutoDrive
            </span>
          </div>

          <div className="space-y-5">
            <div className="divider-red w-16 animate-hero-fade" />
            <h1 className="font-heading text-4xl font-bold text-white leading-tight animate-hero-fade animation-delay-100">
              Junte-se à
              <br />
              <span className="text-primary">nossa frota.</span>
            </h1>
            <p className="text-white/65 text-base max-w-xs animate-hero-fade animation-delay-200">
              Crie sua conta e tenha acesso à plataforma de gestão de veículos mais moderna do mercado.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg py-6 animate-card-enter">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-widest uppercase">AutoDrive</span>
          </div>

          {step === "choice" && (
            <div className="space-y-6">
              <div>
                <div className="divider-red w-10 mb-4" />
                <h2 className="font-heading text-3xl font-bold tracking-wide">Criar conta</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Selecione o perfil que melhor descreve você
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setStep("cliente")}
                  className="group flex items-center gap-5 p-5 rounded-lg bg-card border border-border/60 hover:border-primary/60 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-base tracking-wide">Sou Cliente</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Quero alugar veículos para uso pessoal
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setStep("agente")}
                  className="group flex items-center gap-5 p-5 rounded-lg bg-card border border-border/60 hover:border-primary/60 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-base tracking-wide">Sou Empresa / Banco</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Gestão de frota e análise de crédito
                    </p>
                  </div>
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground pt-2">
                Já tem conta?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
                  Entrar
                </Link>
              </p>
            </div>
          )}

          {step === "cliente" && <RegisterClienteForm onBack={() => setStep("choice")} />}
          {step === "agente" && <RegisterAgenteForm onBack={() => setStep("choice")} />}
        </div>
      </div>
    </div>
  );
}
