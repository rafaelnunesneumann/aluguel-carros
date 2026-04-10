"use client";

import { Users, Car, ClipboardList } from "lucide-react";
import { Header } from "@/components/header";
import { ClienteList } from "@/components/clientes/cliente-list";
import { AutomovelList } from "@/components/automoveis/automovel-list";
import { PedidoList } from "@/components/pedidos/pedido-list";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Tabs defaultValue="clientes">
            <TabsList className="mb-6">
              <TabsTrigger value="clientes" className="gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="automoveis" className="gap-2">
                <Car className="h-4 w-4" />
                Automóveis
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                Pedidos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clientes">
              <ClienteList />
            </TabsContent>

            <TabsContent value="automoveis">
              <AutomovelList />
            </TabsContent>

            <TabsContent value="pedidos">
              <PedidoList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
