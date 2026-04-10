"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clienteService } from "@/services/clienteService";
import { Cliente } from "@/types";
import {
  onlyDigits,
  maskCpf,
  maskPhone,
  maskCurrency,
  parseCurrency,
  formatCpf,
  formatPhone,
} from "@/lib/formatters";

// ── Schema ────────────────────────────────────────────────────

const rendimentoSchema = z.object({
  entidadeEmpregadora: z
    .string()
    .min(1, "Entidade empregadora é obrigatória")
    .max(150, "Máximo 150 caracteres"),
  valor: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((v) => parseCurrency(v) > 0, "Valor deve ser maior que zero"),
});

const clienteSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(150, "Nome deve ter no máximo 150 caracteres"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine(
      (v) => onlyDigits(v).length === 11,
      "CPF deve ter 11 dígitos"
    ),
  rg: z
    .string()
    .min(1, "RG é obrigatório")
    .max(20, "RG deve ter no máximo 20 caracteres"),
  endereco: z
    .string()
    .min(1, "Endereço é obrigatório")
    .max(255, "Endereço deve ter no máximo 255 caracteres"),
  profissao: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  telefone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || onlyDigits(v).length === 0 || onlyDigits(v).length >= 10,
      "Telefone deve ter pelo menos 10 dígitos"
    ),
  rendimentos: z.array(rendimentoSchema).max(3, "Máximo de 3 rendimentos").optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
  onSuccess: () => void;
}

export function ClienteDialog({ open, onOpenChange, cliente, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const isEditing = !!cliente;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      rg: "",
      endereco: "",
      profissao: "",
      email: "",
      telefone: "",
      rendimentos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rendimentos",
  });

  useEffect(() => {
    if (open) {
      if (cliente) {
        reset({
          nome: cliente.nome,
          cpf: formatCpf(cliente.cpf),
          rg: cliente.rg,
          endereco: cliente.endereco,
          profissao: cliente.profissao || "",
          email: cliente.email || "",
          telefone: cliente.telefone ? formatPhone(cliente.telefone) : "",
          rendimentos:
            cliente.rendimentos?.map((r) => ({
              entidadeEmpregadora: r.entidadeEmpregadora,
              valor: r.valor.toFixed(2).replace(".", ","),
            })) || [],
        });
      } else {
        reset({
          nome: "",
          cpf: "",
          rg: "",
          endereco: "",
          profissao: "",
          email: "",
          telefone: "",
          rendimentos: [],
        });
      }
    }
  }, [open, cliente, reset]);

  // ── Mask handlers ─────────────────────────────────────────

  const handleCpfChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("cpf", maskCpf(e.target.value), { shouldValidate: false });
    },
    [setValue]
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("telefone", maskPhone(e.target.value), { shouldValidate: false });
    },
    [setValue]
  );

  // ── Submit ────────────────────────────────────────────────

  const onSubmit = async (data: ClienteFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        cpf: onlyDigits(data.cpf),
        telefone: data.telefone ? onlyDigits(data.telefone) : undefined,
        rendimentos:
          data.rendimentos?.map((r) => ({
            entidadeEmpregadora: r.entidadeEmpregadora,
            valor: parseCurrency(r.valor),
          })) || [],
      };

      if (isEditing && cliente) {
        await clienteService.atualizar(cliente.id, payload);
        toast.success("Cliente atualizado!", {
          description: `${data.nome} foi atualizado com sucesso.`,
        });
      } else {
        await clienteService.criar(payload);
        toast.success("Cliente cadastrado!", {
          description: `${data.nome} foi cadastrado com sucesso.`,
        });
      }
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.errors
          ? Object.values(error.response.data.errors).join(", ")
          : error?.response?.data?.message || "Ocorreu um erro ao salvar o cliente.";
      toast.error("Erro ao salvar", { description: String(message) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] !flex !flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do cliente abaixo."
              : "Preencha os dados para cadastrar um novo cliente."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6">
          <form
            id="cliente-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* ── Dados de Identificação ───────────────────── */}
            <fieldset className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Dados de Identificação</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Obrigatório
                </Badge>
              </div>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {/* Nome */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome completo"
                    {...register("nome")}
                    className={errors.nome ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.nome && (
                    <p className="text-xs text-destructive">{errors.nome.message}</p>
                  )}
                </div>

                {/* CPF */}
                <div className="space-y-1.5">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={watch("cpf")}
                    onChange={handleCpfChange}
                    className={errors.cpf ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.cpf && (
                    <p className="text-xs text-destructive">{errors.cpf.message}</p>
                  )}
                </div>

                {/* RG */}
                <div className="space-y-1.5">
                  <Label htmlFor="rg">RG *</Label>
                  <Input
                    id="rg"
                    placeholder="Digite o RG"
                    {...register("rg")}
                    className={errors.rg ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.rg && (
                    <p className="text-xs text-destructive">{errors.rg.message}</p>
                  )}
                </div>

                {/* Endereço */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    placeholder="Rua, número, bairro, cidade - UF"
                    {...register("endereco")}
                    className={errors.endereco ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.endereco && (
                    <p className="text-xs text-destructive">{errors.endereco.message}</p>
                  )}
                </div>

                {/* E-mail */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* ── Dados Complementares ─────────────────────── */}
            <fieldset className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Dados Complementares</h3>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Opcional
                </Badge>
              </div>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {/* Profissão */}
                <div className="space-y-1.5">
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    placeholder="Ex: Engenheiro"
                    {...register("profissao")}
                    className={errors.profissao ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.profissao && (
                    <p className="text-xs text-destructive">{errors.profissao.message}</p>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-1.5">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    value={watch("telefone") || ""}
                    onChange={handlePhoneChange}
                    className={errors.telefone ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.telefone && (
                    <p className="text-xs text-destructive">{errors.telefone.message}</p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* ── Rendimentos ─────────────────────────────── */}
            <fieldset className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Rendimentos</h3>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 tabular-nums">
                    {fields.length}/3
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ entidadeEmpregadora: "", valor: "" })}
                  disabled={fields.length >= 3}
                  className="gap-1.5 h-8 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </Button>
              </div>
              <Separator />

              {errors.rendimentos && typeof errors.rendimentos.message === "string" && (
                <p className="text-xs text-destructive">{errors.rendimentos.message}</p>
              )}

              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border/60 rounded-lg">
                  <Building2 className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum rendimento adicionado
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    Adicione até 3 fontes de rendimento
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="border-border/60">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Entidade Empregadora</Label>
                              <Input
                                placeholder="Nome da empresa"
                                {...register(
                                  `rendimentos.${index}.entidadeEmpregadora`
                                )}
                                className={
                                  errors.rendimentos?.[index]?.entidadeEmpregadora
                                    ? "border-destructive focus-visible:ring-destructive/30"
                                    : ""
                                }
                              />
                              {errors.rendimentos?.[index]?.entidadeEmpregadora && (
                                <p className="text-xs text-destructive">
                                  {errors.rendimentos[index].entidadeEmpregadora?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Valor (R$)</Label>
                              <Controller
                                control={control}
                                name={`rendimentos.${index}.valor`}
                                render={({ field: f }) => (
                                  <Input
                                    placeholder="0,00"
                                    inputMode="numeric"
                                    value={f.value}
                                    onChange={(e) => {
                                      f.onChange(maskCurrency(e.target.value));
                                    }}
                                    className={
                                      errors.rendimentos?.[index]?.valor
                                        ? "border-destructive focus-visible:ring-destructive/30"
                                        : ""
                                    }
                                  />
                                )}
                              />
                              {errors.rendimentos?.[index]?.valor && (
                                <p className="text-xs text-destructive">
                                  {errors.rendimentos[index].valor?.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 mt-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </fieldset>
          </form>
        </div>

        <DialogFooter className="shrink-0 mx-0 mb-0 rounded-b-xl border-t border-border/60 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="submit" form="cliente-form" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar Alterações" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
