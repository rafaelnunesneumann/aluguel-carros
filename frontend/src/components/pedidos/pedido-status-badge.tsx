"use client";

import { StatusPedido } from "@/types";
import { formatStatusPedido, statusPedidoClass } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface Props {
  status: StatusPedido;
  className?: string;
}

const DOT_COLORS: Record<StatusPedido, string> = {
  CRIADO: "bg-blue-500",
  EM_ANALISE: "bg-amber-500 animate-pulse",
  APROVADO: "bg-emerald-500",
  REPROVADO: "bg-red-500",
  CANCELADO: "bg-zinc-500",
};

export function PedidoStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
        statusPedidoClass(status),
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", DOT_COLORS[status])} />
      {formatStatusPedido(status)}
    </span>
  );
}
