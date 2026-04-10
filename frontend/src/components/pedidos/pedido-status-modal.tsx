"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import { PedidoResponse } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: PedidoResponse | null;
  onSuccess: () => void;
}

const TRANSITIONS: Record<string, string[]> = {
  CRIADO: ["EM_ANALISE"],
  EM_ANALISE: ["APROVADO", "REPROVADO"],
};

const LABEL: Record<string, string> = {
  EM_ANALISE: "Em Análise",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
};

export function PedidoStatusModal({ open, onOpenChange, pedido, onSuccess }: Props) {
  const [novoStatus, setNovoStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const opcoes = pedido ? (TRANSITIONS[pedido.status] ?? []) : [];

  async function handleConfirm() {
    if (!pedido || !novoStatus) return;
    setLoading(true);
    try {
      await api.put(`/pedidos/${pedido.id}/status`, { novoStatus });
      toast.success(`Status alterado para ${LABEL[novoStatus] ?? novoStatus}`);
      onSuccess();
      onOpenChange(false);
      setNovoStatus("");
    } catch {
      toast.error("Erro ao alterar status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setNovoStatus(""); }}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Alterar Status</DialogTitle>
        </DialogHeader>

        {opcoes.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            Não há transições disponíveis para o status atual.
          </p>
        ) : (
          <div className="py-2 space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Selecione o novo status para o pedido&nbsp;
              <span className="font-semibold text-foreground">#{pedido?.id}</span>:
            </p>
            {opcoes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setNovoStatus(s)}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm font-medium transition-colors
                  ${novoStatus === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted"
                  }`}
              >
                {LABEL[s] ?? s}
              </button>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!novoStatus || loading}
          >
            {loading ? "Salvando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
