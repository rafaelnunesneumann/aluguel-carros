"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw, UserCheck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle } from "lucide-react";
import { PedidoTable } from "./pedido-table";
import { PedidoDialog } from "./pedido-dialog";
import { PedidoDetail } from "./pedido-detail";
import { pedidoService } from "@/services/pedidoService";
import { clienteService } from "@/services/clienteService";
import { Cliente, PedidoResponse } from "@/types";
import { formatCpf } from "@/lib/formatters";

export function PedidoList() {
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);

  const fetchClientes = useCallback(async () => {
    setLoadingClientes(true);
    try {
      const data = await clienteService.listarTodos(0, 200);
      setClientes(data.content ?? []);
    } catch {
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoadingClientes(false);
    }
  }, []);

  const fetchPedidos = useCallback(async () => {
    if (!selectedCliente) {
      setPedidos([]);
      return;
    }
    setLoading(true);
    try {
      const data = await pedidoService.listarPorCliente(selectedCliente.id);
      setPedidos(data ?? []);
    } catch {
      toast.error("Erro ao carregar pedidos", {
        description: "Verifique se o servidor está online.",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCliente]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleView = (pedido: PedidoResponse) => {
    setSelectedPedido(pedido);
    setDetailOpen(true);
  };

  const handleCancelRequest = (pedido: PedidoResponse) => {
    setSelectedPedido(pedido);
    setCancelOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedPedido) return;
    try {
      await pedidoService.cancelar(selectedPedido.id);
      toast.success("Pedido cancelado", {
        description: `Pedido #${selectedPedido.id} foi cancelado com sucesso.`,
      });
      fetchPedidos();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Erro ao cancelar pedido.";
      toast.error("Erro ao cancelar", { description: message });
    } finally {
      setCancelOpen(false);
      setSelectedPedido(null);
    }
  };

  const handleSaveSuccess = () => {
    setDialogOpen(false);
    fetchPedidos();
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Pedidos de Aluguel</h2>
          <p className="text-sm text-muted-foreground">
            Crie e acompanhe pedidos de aluguel de automóveis
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          disabled={!selectedCliente}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {/* ── Cliente Selector (simulates login) ── */}
      <Card className="border-border/60 bg-muted/20">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <UserCheck className="h-4 w-4" />
              <span className="font-medium">Visualizando como:</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex gap-2 justify-between items-center min-w-[260px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loadingClientes}
              >
                {selectedCliente ? (
                  <span>
                    {selectedCliente.nome}{" "}
                    <span className="text-muted-foreground font-mono text-xs">
                      ({formatCpf(selectedCliente.cpf)})
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    {loadingClientes ? "Carregando..." : "Selecione um cliente..."}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[320px] max-h-[260px] overflow-y-auto">
                {clientes.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setSelectedCliente(c)}
                    className="flex flex-col items-start gap-0.5 py-2"
                  >
                    <span className="font-medium">{c.nome}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatCpf(c.cpf)}
                    </span>
                  </DropdownMenuItem>
                ))}
                {!loadingClientes && clientes.length === 0 && (
                  <DropdownMenuItem disabled>
                    Nenhum cliente cadastrado
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedCliente && (
              <Button
                variant="outline"
                size="icon"
                onClick={fetchPedidos}
                disabled={loading}
                className="h-9 w-9 shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Pedidos Table ── */}
      {selectedCliente && (
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-semibold">
                Pedidos de {selectedCliente.nome}
              </h3>
              <Badge variant="secondary" className="text-xs font-normal tabular-nums">
                {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <PedidoTable
              pedidos={pedidos}
              loading={loading}
              onView={handleView}
              onCancel={handleCancelRequest}
            />
          </CardContent>
        </Card>
      )}

      {!selectedCliente && !loadingClientes && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <UserCheck className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">Selecione um cliente acima para ver seus pedidos.</p>
        </div>
      )}

      {/* ── Dialogs ── */}
      {selectedCliente && (
        <PedidoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          selectedCliente={selectedCliente}
          onSuccess={handleSaveSuccess}
        />
      )}

      <PedidoDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        pedido={selectedPedido}
      />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <AlertDialogTitle>Cancelar Pedido</AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  Tem certeza que deseja cancelar o{" "}
                  <strong className="text-foreground">
                    Pedido #{selectedPedido?.id}
                  </strong>
                  ? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Sim, cancelar pedido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
