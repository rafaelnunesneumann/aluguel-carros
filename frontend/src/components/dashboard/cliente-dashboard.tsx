"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PedidoList } from "@/components/pedidos/pedido-list";
import { ClienteDialog } from "@/components/clientes/cliente-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, User, ClipboardList, Car, TrendingUp } from "lucide-react";
import { clienteService } from "@/services/clienteService";
import { Cliente } from "@/types";
import { formatCpf, formatPhone, formatCurrency } from "@/lib/formatters";

function PerfilSection({ clienteId }: { clienteId: number }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const load = useCallback(() => {
    clienteService.buscarPorId(clienteId).then(setCliente).catch(() => {});
  }, [clienteId]);

  useEffect(() => { load(); }, [load]);

  if (!cliente) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        <Car className="h-4 w-4 mr-2 animate-spin" style={{ animationDuration: "1s" }} />
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-card-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 border border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold tracking-wide">Meu Perfil</h2>
            <p className="text-xs text-muted-foreground">Seus dados cadastrais</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditOpen(true)}
          className="gap-2 border-border/60 hover:border-primary/50 hover:text-primary"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
      </div>

      <Card className="border-border/50">
        <CardContent className="py-5 px-5 space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
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
              <Separator className="bg-border/40" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Rendimentos
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {cliente.rendimentos.map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between text-sm rounded-md bg-muted/50 border border-border/40 px-3 py-2"
                    >
                      <span className="text-muted-foreground">{r.entidadeEmpregadora}</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {formatCurrency(r.valor)}
                      </span>
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
    </div>
  );
}

function Info({ label, value, mono, span }: { label: string; value: string; mono?: boolean; span?: boolean }) {
  return (
    <div className={span ? "col-span-2 sm:col-span-3 space-y-1" : "space-y-1"}>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      {mono ? (
        <code className="text-sm bg-muted/60 border border-border/40 px-1.5 py-0.5 rounded font-mono">
          {value || "—"}
        </code>
      ) : (
        <p className="text-sm font-medium">{value || "—"}</p>
      )}
    </div>
  );
}

export function ClienteDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-0">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl border border-border/40 bg-card p-6 mb-6 animate-card-enter">
        <div className="absolute inset-0 bg-speed-lines opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-transparent rounded-l-xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
              Portal do Cliente
            </p>
            <h2 className="font-heading text-2xl font-bold tracking-wide">
              Bem-vindo, <span className="text-primary">{user.nome}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Acompanhe seus pedidos de aluguel e gerencie seu perfil
            </p>
          </div>
          <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Car className="h-7 w-7 text-primary animate-float" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="pedidos">
        <TabsList className="h-11 bg-card border border-border/50 p-1 gap-0.5 animate-card-enter animation-delay-100">
          <TabsTrigger
            value="pedidos"
            className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <ClipboardList className="h-4 w-4" />
            Meus Pedidos
          </TabsTrigger>
          <TabsTrigger
            value="perfil"
            className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <User className="h-4 w-4" />
            Meu Perfil
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="pedidos">
            <PedidoList mode="cliente" clienteId={user.userId} />
          </TabsContent>

          <TabsContent value="perfil">
            <PerfilSection clienteId={user.userId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

