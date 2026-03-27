"use client";

import { Header } from "@/components/header";
import { ClienteList } from "@/components/clientes/cliente-list";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <ClienteList />
        </div>
      </main>
    </div>
  );
}
