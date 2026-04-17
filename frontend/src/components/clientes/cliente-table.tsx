"use client";

import { Eye, Pencil, Trash2, MoreHorizontal, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cliente } from "@/types";
import { formatCpf, formatPhone, formatCurrency } from "@/lib/formatters";
import { Skeleton } from "./skeleton";

interface Props {
  clientes: Cliente[];
  loading: boolean;
  onView: (cliente: Cliente) => void;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

export function ClienteTable({ clientes, loading, onView, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-5">
          <div className="rounded-full bg-muted/60 border border-border/40 p-5">
            <Users className="h-9 w-9 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary/30 animate-ping" />
        </div>
        <h3 className="font-heading text-xl font-bold tracking-wide">Nenhum cliente encontrado</h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
          Cadastre um novo cliente clicando no botão acima para começar.
        </p>
      </div>
    );
  }

  const totalRendimentos = (cliente: Cliente) =>
    cliente.rendimentos?.reduce((sum, r) => sum + r.valor, 0) || 0;

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
            <TableHead className="w-[250px] font-semibold text-xs uppercase tracking-widest text-muted-foreground">Nome</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">CPF</TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-xs uppercase tracking-widest text-muted-foreground">Telefone</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-xs uppercase tracking-widest text-muted-foreground">Profissão</TableHead>
            <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-widest text-muted-foreground">
              Renda Total
            </TableHead>
            <TableHead className="w-[70px] text-center font-semibold text-xs uppercase tracking-widest text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow
              key={cliente.id}
              className="cursor-pointer transition-colors hover:bg-accent/50 border-border/40"
              onClick={() => onView(cliente)}
            >
              <TableCell>
                <div className="space-y-0.5">
                  <p className="font-semibold leading-none">{cliente.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {cliente.email || "Sem e-mail"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted/60 border border-border/40 px-2 py-1 rounded-md font-mono">
                  {formatCpf(cliente.cpf)}
                </code>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {cliente.telefone ? (
                  <span className="text-sm">{formatPhone(cliente.telefone)}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {cliente.profissao ? (
                  <span className="inline-flex items-center rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-xs">
                    {cliente.profissao}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right">
                <span className="font-mono text-sm tabular-nums">
                  {formatCurrency(totalRendimentos(cliente))}
                </span>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onView(cliente)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(cliente)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(cliente)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
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
