"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
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
import { AlertTriangle } from "lucide-react";
import { PedidoTable } from "./pedido-table";
import { PedidoDialog } from "./pedido-dialog";
import { PedidoDetail } from "./pedido-detail";
import { PedidoStatusModal } from "./pedido-status-modal";
import { PedidoModifyDialog } from "./pedido-modify-dialog";
import { CreditoDialog } from "@/components/credito/credito-dialog";
import { pedidoService } from "@/services/pedidoService";
import { clienteService } from "@/services/clienteService";
import { useAuth } from "@/contexts/auth-context";
import { Cliente, PedidoResponse } from "@/types";

interface Props {
  mode: "cliente" | "agente";
  clienteId?: number;
}

export function PedidoList({ mode, clienteId }: Props) {
  const { user, isBanco } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // For agente "Novo Pedido" we need a client selector only when creating
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [creditoDialogOpen, setCreditoDialogOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    try {
      let data: PedidoResponse[];
      if (mode === "cliente" && clienteId != null) {
        data = await pedidoService.listarPorCliente(clienteId);
      } else if (mode === "agente") {
        data = await pedidoService.listarTodos();
      } else {
        data = [];
      }
      setPedidos(data ?? []);
    } catch {
      toast.error("Erro ao carregar pedidos", { description: "Verifique se o servidor está online." });
    } finally {
      setLoading(false);
    }
  }, [mode, clienteId]);

  // Only needed for agente creating a pedido – load clients for the dialog trigger
  useEffect(() => {
    if (mode === "agente") {
      clienteService.listarTodos(0, 200).then((p) => setClientes(p.content ?? [])).catch(() => {});
    }
  }, [mode]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleView = (p: PedidoResponse) => { setSelectedPedido(p); setDetailOpen(true); };
  const handleCancelRequest = (p: PedidoResponse) => { setSelectedPedido(p); setCancelOpen(true); };
  const handleChangeStatus = (p: PedidoResponse) => { setSelectedPedido(p); setStatusModalOpen(true); };
  const handleModify = (p: PedidoResponse) => { setSelectedPedido(p); setModifyDialogOpen(true); };
  const handleConcederCredito = (p: PedidoResponse) => { setSelectedPedido(p); setCreditoDialogOpen(true); };

  const handleCancelConfirm = async () => {
    if (!selectedPedido) return;
    try {
      await pedidoService.cancelar(selectedPedido.id);
      toast.success("Pedido cancelado", { description: `Pedido #${selectedPedido.id} cancelado com sucesso.` });
      fetchPedidos();
    } catch (error: any) {
      toast.error("Erro ao cancelar", { description: error?.response?.data?.message || "Erro ao cancelar pedido." });
    } finally {
      setCancelOpen(false);
      setSelectedPedido(null);
    }
  };

  // For cliente mode, the "active" client comes from auth context; for dialog we pass user's Cliente
  const clienteParaDialog: Cliente | null =
    mode === "cliente" && user
      ? ({ id: user.userId, nome: user.nome } as Cliente)
      : selectedCliente;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Pedidos de Aluguel</h2>
          <p className="text-sm text-muted-foreground">
            {mode === "cliente"
              ? "Seus pedidos de aluguel"
              : "Todos os pedidos de aluguel do sistema"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchPedidos} disabled={loading} className="h-9 w-9">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {mode === "cliente" && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Pedido
            </Button>
          )}
        </div>
      </div>

      {/* ── Pedidos Table ── */}
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold">Pedidos</h3>
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
            mode={mode}
            onChangeStatus={mode === "agente" ? handleChangeStatus : undefined}
            onModify={handleModify}
            onConcederCredito={mode === "agente" && isBanco ? handleConcederCredito : undefined}
          />
        </CardContent>
      </Card>

      {/* ── Dialogs ── */}
      {clienteParaDialog && (
        <PedidoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          selectedCliente={clienteParaDialog}
          onSuccess={() => { setDialogOpen(false); fetchPedidos(); }}
        />
      )}

      <PedidoDetail open={detailOpen} onOpenChange={setDetailOpen} pedido={selectedPedido} />

      <PedidoStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        pedido={selectedPedido}
        onSuccess={fetchPedidos}
      />

      <PedidoModifyDialog
        open={modifyDialogOpen}
        onOpenChange={setModifyDialogOpen}
        pedido={selectedPedido}
        onSuccess={fetchPedidos}
      />

      <CreditoDialog
        open={creditoDialogOpen}
        onOpenChange={setCreditoDialogOpen}
        pedido={selectedPedido}
        onSuccess={fetchPedidos}
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
                  <strong className="text-foreground">Pedido #{selectedPedido?.id}</strong>?
                  Esta ação não pode ser desfeita.
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


