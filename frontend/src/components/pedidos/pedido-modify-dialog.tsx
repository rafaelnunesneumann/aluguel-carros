"use client";

import { useEffect, useState } from "react";
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
import { automovelService } from "@/services/automovelService";
import { Automovel, PedidoResponse } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: PedidoResponse | null;
  onSuccess: () => void;
}

export function PedidoModifyDialog({ open, onOpenChange, pedido, onSuccess }: Props) {
  const [automoveis, setAutomoveis] = useState<Automovel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      automovelService.listarDisponiveis().then(setAutomoveis).catch(() => {});
      setSelectedId(null);
    }
  }, [open]);

  async function handleConfirm() {
    if (!pedido || !selectedId) return;
    setLoading(true);
    try {
      await api.put(`/pedidos/${pedido.id}`, { automovelId: selectedId });
      toast.success("Automóvel alterado com sucesso");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Erro ao modificar pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Modificar Pedido #{pedido?.id}</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
          {automoveis.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum automóvel disponível.</p>
          ) : (
            automoveis.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-colors
                  ${selectedId === a.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-muted"
                  }`}
              >
                <span className="font-medium">{a.marca} {a.modelo}</span>
                <span className="ml-2 text-muted-foreground text-xs">
                  {a.ano} — {a.placa}
                </span>
              </button>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId || loading}>
            {loading ? "Salvando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
