"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  const [cancelLoading, setCancelLoading] = useState(false);
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
    setCancelLoading(true);
    try {
      await pedidoService.cancelar(selectedPedido.id);
      toast.success("Pedido cancelado", { description: `Pedido #${selectedPedido.id} cancelado com sucesso.` });
      fetchPedidos();
    } catch (error: any) {
      toast.error("Erro ao cancelar", { description: error?.response?.data?.message || "Erro ao cancelar pedido." });
    } finally {
      setCancelLoading(false);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-card-enter">
        <div className="space-y-1">
          <div className="divider-red w-8 mb-3" />
          <h2 className="font-heading text-3xl font-bold tracking-wide">Pedidos de Aluguel</h2>
          <p className="text-sm text-muted-foreground">
            {mode === "cliente"
              ? "Seus pedidos de aluguel"
              : "Todos os pedidos de aluguel do sistema"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchPedidos} disabled={loading} className="h-9 w-9 border-border/60">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {mode === "cliente" && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2 btn-shimmer border-0 font-heading font-semibold tracking-wider uppercase text-sm h-10">
              <Plus className="h-4 w-4" />
              Novo Pedido
            </Button>
          )}
        </div>
      </div>

      {/* ── Pedidos Table ── */}
      <div className="animate-card-enter animation-delay-100">
        <div className="flex items-center gap-2.5 mb-4">
          <h3 className="font-heading text-base font-semibold tracking-wide">Lista de Pedidos</h3>
          <span className="inline-flex items-center rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-xs font-medium tabular-nums">
            {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
          </span>
        </div>
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
      </div>

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

      <AlertDialog open={cancelOpen} onOpenChange={(v) => { if (!cancelLoading) setCancelOpen(v); }}>
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
            <AlertDialogCancel disabled={cancelLoading}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={cancelLoading}
              className="bg-destructive text-white hover:bg-destructive/90 disabled:opacity-70"
            >
              {cancelLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Sim, cancelar pedido"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


