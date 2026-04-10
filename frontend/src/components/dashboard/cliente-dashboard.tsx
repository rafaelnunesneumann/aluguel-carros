"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PedidoList } from "@/components/pedidos/pedido-list";
import { ClienteDialog } from "@/components/clientes/cliente-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, User } from "lucide-react";
import { clienteService } from "@/services/clienteService";
import { Cliente } from "@/types";
import { formatCpf, formatPhone } from "@/lib/formatters";
import { formatCurrency } from "@/lib/formatters";

function PerfilSection({ clienteId }: { clienteId: number }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const load = useCallback(() => {
    clienteService.buscarPorId(clienteId).then(setCliente).catch(() => {});
  }, [clienteId]);

  useEffect(() => { load(); }, [load]);

  if (!cliente) return <p className="text-sm text-muted-foreground py-6 text-center">Carregando...</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Meu Perfil</h2>
        </div>
        <Button size="sm" variant="outline" onClick={() => setEditOpen(true)} className="gap-2">
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
      </div>

      <Card className="border-border/60">
        <CardContent className="py-4 px-5 space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            <Info label="Nome" value={cliente.nome} span />
            <Info label="CPF" value={formatCpf(cliente.cpf)} mono />
            <Info label="RG" value={cliente.rg} mono />
            <Info label="E-mail" value={cliente.email} />
            <Info label="Telefone" value={cliente.telefone ? formatPhone(cliente.telefone) : "—"} />
            <Info label="Profissão" value={cliente.profissao || "—"} />
            <Info label="Endereço" value={cliente.endereco} span />
          </div>

          {cliente.rendimentos && cliente.rendimentos.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rendimentos</p>
                <div className="flex flex-col gap-2">
                  {cliente.rendimentos.map((r) => (
                    <div key={r.id} className="flex justify-between text-sm rounded-md bg-muted/40 px-3 py-2">
                      <span>{r.entidadeEmpregadora}</span>
                      <span className="font-medium tabular-nums">{formatCurrency(r.valor)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ClienteDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        cliente={cliente}
        onSuccess={() => { setEditOpen(false); load(); }}
      />
    </>
  );
}

function Info({ label, value, mono, span }: { label: string; value: string; mono?: boolean; span?: boolean }) {
  return (
    <div className={span ? "col-span-2 sm:col-span-3 space-y-0.5" : "space-y-0.5"}>
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
      {mono
        ? <code className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">{value || "—"}</code>
        : <p className="text-sm font-medium">{value || "—"}</p>
      }
    </div>
  );
}

export function ClienteDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Tabs defaultValue="pedidos">
      <TabsList>
        <TabsTrigger value="pedidos">Meus Pedidos</TabsTrigger>
        <TabsTrigger value="perfil">Meu Perfil</TabsTrigger>
      </TabsList>

      <TabsContent value="pedidos">
        <PedidoList mode="cliente" clienteId={user.userId} />
      </TabsContent>

      <TabsContent value="perfil">
        <PerfilSection clienteId={user.userId} />
      </TabsContent>
    </Tabs>
  );
}
