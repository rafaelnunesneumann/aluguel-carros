"use client";

import { useAuth } from "@/contexts/auth-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PedidoList } from "@/components/pedidos/pedido-list";
import { AutomovelList } from "@/components/automoveis/automovel-list";
import { ClienteList } from "@/components/clientes/cliente-list";

export function AgenteDashboard() {
  const { isBanco } = useAuth();

  return (
    <Tabs defaultValue="pedidos">
      <TabsList>
        <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        <TabsTrigger value="automoveis">Automóveis</TabsTrigger>
        <TabsTrigger value="clientes">Clientes</TabsTrigger>
        {isBanco && <TabsTrigger value="creditos">Créditos</TabsTrigger>}
      </TabsList>

      <TabsContent value="pedidos">
        <PedidoList mode="agente" />
      </TabsContent>

      <TabsContent value="automoveis">
        <AutomovelList />
      </TabsContent>

      <TabsContent value="clientes">
        <ClienteList />
      </TabsContent>

      {isBanco && (
        <TabsContent value="creditos">
          {/* Credit management view — pedidos with credito concedido */}
          <PedidoList mode="agente" />
        </TabsContent>
      )}
    </Tabs>
  );
}
