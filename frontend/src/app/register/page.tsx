"use client";

import { useState } from "react";
import RegisterClienteForm from "@/components/auth/register-cliente-form";
import RegisterAgenteForm from "@/components/auth/register-agente-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type Step = "choice" | "cliente" | "agente";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("choice");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {step === "choice" && (
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Escolha o tipo de conta</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => setStep("cliente")} className="w-full">
              Sou Cliente
            </Button>
            <Button variant="outline" onClick={() => setStep("agente")} className="w-full">
              Sou Empresa / Banco
            </Button>
          </CardContent>
        </Card>
      )}
      {step === "cliente" && <RegisterClienteForm onBack={() => setStep("choice")} />}
      {step === "agente" && <RegisterAgenteForm onBack={() => setStep("choice")} />}
    </div>
  );
}
