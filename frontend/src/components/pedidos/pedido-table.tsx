"use client";

import { Eye, XCircle, MoreHorizontal, ClipboardList, CheckSquare, CreditCard, Pencil } from "lucide-react";
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
  onChangeStatus?: (pedido: PedidoResponse) => void;
  onModify?: (pedido: PedidoResponse) => void;
  onConcederCredito?: (pedido: PedidoResponse) => void;
  mode?: "cliente" | "agente";
}

export function PedidoTable({
  pedidos,
  loading,
  onView,
  onCancel,
  onChangeStatus,
  onModify,
  onConcederCredito,
  mode = "cliente",
}: Props) {
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
        <div className="relative mb-5">
          <div className="rounded-full bg-muted/60 border border-border/40 p-5">
            <ClipboardList className="h-9 w-9 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary/30 animate-ping" />
        </div>
        <h3 className="font-heading text-xl font-bold tracking-wide">Nenhum pedido encontrado</h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
          {mode === "cliente"
            ? "Você ainda não possui pedidos. Crie um novo pedido de aluguel."
            : "Nenhum pedido cadastrado no sistema."}
        </p>
      </div>
    );
  }

  const canCancel = (pedido: PedidoResponse) =>
    pedido.status === "CRIADO" || pedido.status === "EM_ANALISE";

  const canChangeStatus = (pedido: PedidoResponse) =>
    pedido.status === "CRIADO" || pedido.status === "EM_ANALISE";

  const canModify = (pedido: PedidoResponse) =>
    pedido.status === "CRIADO" || (mode === "agente" && pedido.status === "EM_ANALISE");

  const canConcederCredito = (pedido: PedidoResponse) =>
    pedido.status === "APROVADO";

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
            <TableHead className="w-[60px] font-semibold text-xs uppercase tracking-widest text-muted-foreground">#</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Cliente</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Automóvel</TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-xs uppercase tracking-widest text-muted-foreground">Placa</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-xs uppercase tracking-widest text-muted-foreground">Data</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Status</TableHead>
            <TableHead className="w-[70px] text-center font-semibold text-xs uppercase tracking-widest text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow
              key={pedido.id}
              className="cursor-pointer transition-colors hover:bg-accent/50 border-border/40"
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
                  <p className="font-heading font-semibold leading-none text-sm">{pedido.automovelMarca}</p>
                  <p className="text-xs text-muted-foreground">{pedido.automovelModelo}</p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <code className="text-xs bg-muted/60 border border-border/40 px-2 py-1 rounded-md font-mono">
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
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => onView(pedido)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>

                    {onModify && canModify(pedido) && (
                      <DropdownMenuItem onClick={() => onModify(pedido)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modificar
                      </DropdownMenuItem>
                    )}

                    {onChangeStatus && canChangeStatus(pedido) && (
                      <DropdownMenuItem onClick={() => onChangeStatus(pedido)}>
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Avaliar
                      </DropdownMenuItem>
                    )}

                    {onConcederCredito && canConcederCredito(pedido) && (
                      <DropdownMenuItem onClick={() => onConcederCredito(pedido)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Conceder Crédito
                      </DropdownMenuItem>
                    )}

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


