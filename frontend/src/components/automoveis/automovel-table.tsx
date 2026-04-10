"use client";

import { Car, Pencil, Trash2, MoreHorizontal } from "lucide-react";
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
import { Automovel } from "@/types";
import { Skeleton } from "@/components/clientes/skeleton";

interface Props {
  automoveis: Automovel[];
  loading: boolean;
  onEdit: (automovel: Automovel) => void;
  onDelete: (automovel: Automovel) => void;
}

export function AutomovelTable({ automoveis, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (automoveis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Car className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Nenhum automóvel cadastrado</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Cadastre um novo automóvel clicando no botão acima para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold">Marca / Modelo</TableHead>
            <TableHead className="font-semibold">Matrícula</TableHead>
            <TableHead className="font-semibold">Placa</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">Ano</TableHead>
            <TableHead className="w-[70px] text-center font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {automoveis.map((automovel) => (
            <TableRow key={automovel.id} className="transition-colors">
              <TableCell>
                <div className="space-y-0.5">
                  <p className="font-medium leading-none">{automovel.marca}</p>
                  <p className="text-xs text-muted-foreground">{automovel.modelo}</p>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded-md font-mono">
                  {automovel.matricula}
                </code>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded-md font-mono">
                  {automovel.placa}
                </code>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">
                {automovel.ano}
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
                    <DropdownMenuItem onClick={() => onEdit(automovel)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(automovel)}
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
