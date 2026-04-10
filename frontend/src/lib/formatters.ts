// ── Display formatters ─────────────────────────────────────

export function formatCpf(cpf: string | undefined | null): string {
  if (!cpf) return "";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// ── Live input masks (aplicadas enquanto o usuário digita) ──

export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskCurrency(value: string): string {
  // Remove tudo que não for dígito
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  // Converte para centavos
  const cents = parseInt(digits, 10);
  const reais = (cents / 100).toFixed(2);

  // Formata com separadores pt-BR
  const [intPart, decPart] = reais.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted},${decPart}`;
}

/** Converte string formatada "1.234,56" -> number 1234.56 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatDateOnly(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString + "T00:00:00");
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

// ── StatusPedido helpers ─────────────────────────────────────

import type { StatusPedido } from "@/types";

export function formatStatusPedido(status: StatusPedido): string {
  const labels: Record<StatusPedido, string> = {
    CRIADO: "Criado",
    EM_ANALISE: "Em Análise",
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    CANCELADO: "Cancelado",
  };
  return labels[status] ?? status;
}

export type StatusVariant = "default" | "secondary" | "outline" | "destructive";

export function statusPedidoVariant(status: StatusPedido): StatusVariant {
  const map: Record<StatusPedido, StatusVariant> = {
    CRIADO: "secondary",
    EM_ANALISE: "default",
    APROVADO: "default",
    REPROVADO: "destructive",
    CANCELADO: "outline",
  };
  return map[status] ?? "secondary";
}

export function statusPedidoClass(status: StatusPedido): string {
  const map: Record<StatusPedido, string> = {
    CRIADO: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    EM_ANALISE: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    APROVADO: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    REPROVADO: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    CANCELADO: "bg-muted text-muted-foreground border-border",
  };
  return map[status] ?? "";
}
