"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  FileText,
  Building2,
  Calendar,
} from "lucide-react";
import { Cliente } from "@/types";
import { formatCpf, formatCurrency, formatPhone, formatDate } from "@/lib/formatters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
}

export function ClienteDetail({ open, onOpenChange, cliente }: Props) {
  if (!cliente) return null;

  const totalRendimentos =
    cliente.rendimentos?.reduce((sum, r) => sum + r.valor, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[90vh] !flex !flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            {cliente.nome}
          </DialogTitle>
          <DialogDescription>Detalhes completos do cliente</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
          <div className="space-y-5 pb-4">
            {/* ── Identificação ───────────────────────────── */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                Identificação
              </h3>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="CPF" value={formatCpf(cliente.cpf)} mono />
                <InfoItem label="RG" value={cliente.rg} mono />
              </div>
            </section>

            {/* ── Contato ─────────────────────────────────── */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                Contato
              </h3>
              <Separator />
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{cliente.endereco}</span>
                </div>
                {cliente.email && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{cliente.email}</span>
                  </div>
                )}
                {cliente.telefone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{formatPhone(cliente.telefone)}</span>
                  </div>
                )}
              </div>
            </section>

            {/* ── Profissional ────────────────────────────── */}
            {cliente.profissao && (
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5" />
                  Profissional
                </h3>
                <Separator />
                <Badge variant="secondary" className="text-sm font-normal">
                  {cliente.profissao}
                </Badge>
              </section>
            )}

            {/* ── Rendimentos ─────────────────────────────── */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5" />
                  Rendimentos
                </h3>
                <Badge variant="outline" className="text-xs font-mono tabular-nums">
                  Total: {formatCurrency(totalRendimentos)}
                </Badge>
              </div>
              <Separator />

              {cliente.rendimentos && cliente.rendimentos.length > 0 ? (
                <div className="space-y-2">
                  {cliente.rendimentos.map((rendimento, index) => (
                    <Card key={rendimento.id || index} className="border-border/60">
                      <CardContent className="py-3 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium">
                            {rendimento.entidadeEmpregadora}
                          </p>
                        </div>
                        <span className="font-mono text-sm font-semibold text-emerald-500 tabular-nums">
                          {formatCurrency(rendimento.valor)}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Nenhum rendimento cadastrado
                </p>
              )}
            </section>

            {/* ── Registro ────────────────────────────────── */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Registro
              </h3>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Cadastrado em" value={formatDate(cliente.createdAt)} />
                <InfoItem label="Atualizado em" value={formatDate(cliente.updatedAt)} />
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${mono ? "font-mono tabular-nums" : ""}`}>
        {value}
      </p>
    </div>
  );
}
