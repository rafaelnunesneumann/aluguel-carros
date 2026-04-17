"use client";

import { useAuth } from "@/contexts/auth-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PedidoList } from "@/components/pedidos/pedido-list";
import { AutomovelList } from "@/components/automoveis/automovel-list";
import { ClienteList } from "@/components/clientes/cliente-list";
import { Car, Users, ClipboardList, Banknote, TrendingUp } from "lucide-react";

function WelcomeBanner({ nome, tipo }: { nome: string; tipo: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/40 bg-card p-6 mb-6 animate-card-enter">
      {/* Speed lines bg */}
      <div className="absolute inset-0 bg-speed-lines opacity-40" />
      {/* Red gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-transparent" />
      {/* Left red border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-transparent rounded-l-xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
            Painel — {tipo === "BANCO" ? "Banco" : "Empresa"}
          </p>
          <h2 className="font-heading text-2xl font-bold tracking-wide">
            Olá, <span className="text-primary">{nome}</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie pedidos, automóveis e clientes pelo painel abaixo
          </p>
        </div>
        <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <TrendingUp className="h-7 w-7 text-primary" />
        </div>
      </div>
    </div>
  );
}

export function AgenteDashboard() {
  const { isBanco, user } = useAuth();

  return (
    <div className="space-y-0">
      <WelcomeBanner nome={user?.nome ?? "Usuário"} tipo={user?.userType ?? "EMPRESA"} />

      <Tabs defaultValue="pedidos">
        <TabsList className="h-11 bg-card border border-border/50 p-1 gap-0.5 animate-card-enter animation-delay-100">
          <TabsTrigger
            value="pedidos"
            className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <ClipboardList className="h-4 w-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger
            value="automoveis"
            className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <Car className="h-4 w-4" />
            Automóveis
          </TabsTrigger>
          <TabsTrigger
            value="clientes"
            className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
          {isBanco && (
            <TabsTrigger
              value="creditos"
              className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Banknote className="h-4 w-4" />
              Créditos
            </TabsTrigger>
          )}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="pedidos">
            <PedidoList mode="agente" />
          </TabsContent>

          <TabsContent value="automoveis">
            <AutomovelList />
          </TabsContent>

          <TabsContent value="clientes">
            <ClienteList />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
