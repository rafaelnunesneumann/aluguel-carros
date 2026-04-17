"use client";

import { Car, Pencil, Trash2, MoreHorizontal, Calendar, Hash } from "lucide-react";
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

const BRAND_INITIALS: Record<string, string> = {
  BMW: "BMW",
  MERCEDES: "MB",
  TOYOTA: "TYT",
  HONDA: "HND",
  FORD: "FRD",
  VOLKSWAGEN: "VW",
  CHEVROLET: "CHV",
  HYUNDAI: "HYN",
  KIA: "KIA",
  NISSAN: "NSN",
  AUDI: "AUD",
  PORSCHE: "POR",
  FERRARI: "FER",
  LAMBORGHINI: "LAM",
  FIAT: "FIA",
  RENAULT: "REN",
  PEUGEOT: "PGT",
  CITROEN: "CTR",
};

const BRAND_GRADIENT: Record<string, string> = {
  BMW: "from-[#1c2a6b] to-[#0a1240]",
  MERCEDES: "from-[#1a1f28] to-[#0d1017]",
  TOYOTA: "from-[#8b0000] to-[#3d0000]",
  HONDA: "from-[#cc0000] to-[#770000]",
  FORD: "from-[#003178] to-[#001347]",
  VOLKSWAGEN: "from-[#001e6b] to-[#000f38]",
  CHEVROLET: "from-[#c59a00] to-[#7a6000]",
  HYUNDAI: "from-[#002c5f] to-[#001228]",
  KIA: "from-[#bb162b] to-[#600010]",
  PORSCHE: "from-[#8b1a1a] to-[#3d0000]",
  FERRARI: "from-[#c8102e] to-[#6e0017]",
  AUDI: "from-[#bb0000] to-[#5a0000]",
};

function getGradient(marca: string): string {
  const key = marca.toUpperCase().trim().split(" ")[0];
  return BRAND_GRADIENT[key] ?? "from-[#1a1010] to-[#0a0505]";
}

function getInitials(marca: string): string {
  const key = marca.toUpperCase().trim().split(" ")[0];
  return BRAND_INITIALS[key] ?? marca.slice(0, 3).toUpperCase();
}

export function AutomovelTable({ automoveis, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (automoveis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-5">
          <div className="rounded-full bg-muted/60 border border-border/40 p-6">
            <Car className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary/30 animate-ping" />
        </div>
        <h3 className="font-heading text-xl font-bold tracking-wide">Nenhum automóvel cadastrado</h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
          Adicione o primeiro veículo à frota clicando no botão acima.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {automoveis.map((automovel, idx) => (
        <div
          key={automovel.id}
          className="vehicle-card rounded-xl animate-card-enter"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          {/* Card top — brand hero */}
          <div className={`relative h-28 bg-gradient-to-br ${getGradient(automovel.marca)} flex items-center justify-between px-5 overflow-hidden`}>
            {/* Speed lines */}
            <div className="absolute inset-0 bg-speed-lines opacity-30" />
            {/* Red top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-transparent" />

            <div className="relative z-10">
              <span className="font-heading text-3xl font-bold text-white/90 tracking-wider">
                {getInitials(automovel.marca)}
              </span>
              <p className="text-white/50 text-xs tracking-widest uppercase mt-0.5">
                {automovel.marca}
              </p>
            </div>

            {/* Year badge */}
            <div className="relative z-10 flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="font-heading font-bold text-white text-sm">{automovel.ano}</span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-heading text-base font-bold tracking-wide text-foreground leading-tight">
                {automovel.modelo}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-widest">
                {automovel.marca}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 bg-muted/60 border border-border/40 rounded-md px-2.5 py-1.5 flex-1 min-w-0">
                <Hash className="h-3.5 w-3.5 text-primary shrink-0" />
                <code className="text-xs font-mono text-foreground truncate">{automovel.placa}</code>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/60 border border-border/40 rounded-md px-2.5 py-1.5 flex-1 min-w-0">
                <Car className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <code className="text-xs font-mono text-muted-foreground truncate">{automovel.matricula}</code>
              </div>
            </div>
          </div>

          {/* Card footer */}
          <div className="flex items-center justify-between border-t border-border/40 px-4 py-3">
            <button
              onClick={() => onEdit(automovel)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Mais ações</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(automovel)} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(automovel)}
                  className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
