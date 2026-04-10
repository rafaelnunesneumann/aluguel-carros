"use client";

import { Badge } from "@/components/ui/badge";
import { StatusPedido } from "@/types";
import { formatStatusPedido, statusPedidoClass } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface Props {
  status: StatusPedido;
  className?: string;
}

export function PedidoStatusBadge({ status, className }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border",
        statusPedidoClass(status),
        className
      )}
    >
      {formatStatusPedido(status)}
    </Badge>
  );
}
