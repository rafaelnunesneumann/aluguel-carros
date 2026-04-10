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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { concederCredito } from "@/services/contratoService";
import { PedidoResponse } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: PedidoResponse | null;
  onSuccess: () => void;
}

export function CreditoDialog({ open, onOpenChange, pedido, onSuccess }: Props) {
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  function handleClose(v: boolean) {
    onOpenChange(v);
    if (!v) setValor("");
  }

  async function handleConfirm() {
    if (!pedido) return;
    const num = parseFloat(valor.replace(",", "."));
    if (isNaN(num) || num <= 0) {
      toast.error("Informe um valor válido");
      return;
    }
    setLoading(true);
    try {
      await concederCredito(pedido.id, num);
      toast.success("Crédito concedido com sucesso");
      onSuccess();
      handleClose(false);
    } catch {
      toast.error("Erro ao conceder crédito");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Conceder Crédito</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-3">
          <p className="text-sm text-muted-foreground">
            Pedido&nbsp;
            <span className="font-semibold text-foreground">#{pedido?.id}</span>
            &nbsp;—&nbsp;
            <span className="font-semibold text-foreground">{pedido?.clienteNome}</span>
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="valor-credito">Valor (R$)</Label>
            <Input
              id="valor-credito"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!valor || loading}>
            {loading ? "Salvando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
