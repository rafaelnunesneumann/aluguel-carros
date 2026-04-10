"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  User,
  Car,
  Calendar,
  Hash,
  CreditCard,
} from "lucide-react";
import { PedidoResponse } from "@/types";
import { formatCpf, formatDate, formatDateOnly } from "@/lib/formatters";
import { PedidoStatusBadge } from "./pedido-status-badge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: PedidoResponse | null;
}

function InfoItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | number | undefined | null;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      {mono ? (
        <code className="text-sm bg-muted px-2 py-0.5 rounded-md font-mono">
          {value ?? "—"}
        </code>
      ) : (
        <p className="text-sm font-medium">{value ?? "—"}</p>
      )}
    </div>
  );
}

export function PedidoDetail({ open, onOpenChange, pedido }: Props) {
  if (!pedido) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] !flex !flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
            Pedido #{pedido.id}
          </DialogTitle>
          <DialogDescription>Detalhes completos do pedido de aluguel</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 space-y-5">
          {/* ── Status & Datas ── */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Hash className="h-3.5 w-3.5" />
              Pedido
            </h3>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </p>
                <PedidoStatusBadge status={pedido.status} />
              </div>
              <InfoItem label="ID" value={`#${pedido.id}`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Data de Criação"
                value={formatDateOnly(pedido.dataCriacao)}
              />
              <InfoItem
                label="Última Atualização"
                value={formatDate(pedido.dataAtualizacao)}
              />
            </div>
          </section>

          {/* ── Cliente ── */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              Cliente
            </h3>
            <Separator />
            <Card className="border-border/60">
              <CardContent className="py-3 px-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Nome" value={pedido.clienteNome} />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      CPF
                    </p>
                    <code className="text-sm bg-muted px-2 py-0.5 rounded-md font-mono">
                      {formatCpf(pedido.clienteCpf)}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── Automóvel ── */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Car className="h-3.5 w-3.5" />
              Automóvel
            </h3>
            <Separator />
            <Card className="border-border/60">
              <CardContent className="py-3 px-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Marca" value={pedido.automovelMarca} />
                  <InfoItem label="Modelo" value={pedido.automovelModelo} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <InfoItem label="Ano" value={pedido.automovelAno} />
                  <InfoItem label="Placa" value={pedido.automovelPlaca} mono />
                  <InfoItem
                    label="Matrícula"
                    value={pedido.automovelMatricula}
                    mono
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
