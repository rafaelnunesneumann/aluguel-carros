"use client";

import { Eye, XCircle, MoreHorizontal, ClipboardList } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PedidoResponse } from "@/types";
import { formatDateOnly } from "@/lib/formatters";
import { PedidoStatusBadge } from "./pedido-status-badge";
import { Skeleton } from "@/components/clientes/skeleton";

interface Props {
  pedidos: PedidoResponse[];
  loading: boolean;
  onView: (pedido: PedidoResponse) => void;
  onCancel: (pedido: PedidoResponse) => void;
}

export function PedidoTable({ pedidos, loading, onView, onCancel }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Nenhum pedido encontrado</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Selecione um cliente e crie um novo pedido de aluguel.
        </p>
      </div>
    );
  }

  const canCancel = (pedido: PedidoResponse) =>
    pedido.status === "CRIADO" || pedido.status === "EM_ANALISE";

  return (
    <div className="rounded-lg border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[60px] font-semibold">#</TableHead>
            <TableHead className="font-semibold">Cliente</TableHead>
            <TableHead className="font-semibold">Automóvel</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">Placa</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Data</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="w-[70px] text-center font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow
              key={pedido.id}
              className="cursor-pointer transition-colors"
              onClick={() => onView(pedido)}
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                #{pedido.id}
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{pedido.clienteNome}</p>
              </TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  <p className="font-medium leading-none text-sm">{pedido.automovelMarca}</p>
                  <p className="text-xs text-muted-foreground">{pedido.automovelModelo}</p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <code className="text-xs bg-muted px-2 py-1 rounded-md font-mono">
                  {pedido.automovelPlaca}
                </code>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {formatDateOnly(pedido.dataCriacao)}
              </TableCell>
              <TableCell>
                <PedidoStatusBadge status={pedido.status} />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onView(pedido)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    {canCancel(pedido) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onCancel(pedido)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
