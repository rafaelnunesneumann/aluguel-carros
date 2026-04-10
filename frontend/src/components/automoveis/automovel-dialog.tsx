"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { automovelService } from "@/services/automovelService";
import { Automovel } from "@/types";

const automovelSchema = z.object({
  marca: z.string().min(1, "Marca é obrigatória").max(100, "Máximo 100 caracteres"),
  modelo: z.string().min(1, "Modelo é obrigatório").max(100, "Máximo 100 caracteres"),
  matricula: z.string().min(1, "Matrícula é obrigatória").max(20, "Máximo 20 caracteres"),
  placa: z.string().min(1, "Placa é obrigatória").max(10, "Máximo 10 caracteres"),
  ano: z
    .number({ message: "Ano deve ser um número" })
    .int("Ano deve ser inteiro")
    .min(1886, "Ano deve ser a partir de 1886")
    .max(2100, "Ano inválido"),
});

type AutomovelFormData = z.infer<typeof automovelSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automovel: Automovel | null;
  onSuccess: () => void;
}

export function AutomovelDialog({ open, onOpenChange, automovel, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const isEditing = !!automovel;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AutomovelFormData>({
    resolver: zodResolver(automovelSchema),
    defaultValues: {
      marca: "",
      modelo: "",
      matricula: "",
      placa: "",
      ano: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    if (open) {
      if (automovel) {
        reset({
          marca: automovel.marca,
          modelo: automovel.modelo,
          matricula: automovel.matricula,
          placa: automovel.placa,
          ano: automovel.ano,
        });
      } else {
        reset({
          marca: "",
          modelo: "",
          matricula: "",
          placa: "",
          ano: new Date().getFullYear(),
        });
      }
    }
  }, [open, automovel, reset]);

  const onSubmit = async (data: AutomovelFormData) => {
    setSaving(true);
    try {
      if (isEditing && automovel) {
        await automovelService.atualizar(automovel.id, data);
        toast.success("Automóvel atualizado!", {
          description: `${data.marca} ${data.modelo} foi atualizado com sucesso.`,
        });
      } else {
        await automovelService.criar(data);
        toast.success("Automóvel cadastrado!", {
          description: `${data.marca} ${data.modelo} foi cadastrado com sucesso.`,
        });
      }
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.errors
          ? Object.values(error.response.data.errors).join(", ")
          : error?.response?.data?.message || "Erro ao salvar automóvel.";
      toast.error(isEditing ? "Erro ao atualizar" : "Erro ao cadastrar", {
        description: message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] !flex !flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? "Editar Automóvel" : "Novo Automóvel"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do automóvel abaixo."
              : "Preencha os dados para cadastrar um novo automóvel."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6">
          <form
            id="automovel-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* ── Identificação do Veículo ── */}
            <fieldset className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Identificação do Veículo</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Obrigatório
                </Badge>
              </div>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="marca">
                    Marca <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="marca"
                    placeholder="Ex: Toyota"
                    {...register("marca")}
                    className={errors.marca ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.marca && (
                    <p className="text-xs text-destructive">{errors.marca.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="modelo">
                    Modelo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="modelo"
                    placeholder="Ex: Corolla"
                    {...register("modelo")}
                    className={errors.modelo ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.modelo && (
                    <p className="text-xs text-destructive">{errors.modelo.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="ano">
                    Ano <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ano"
                    type="number"
                    min={1886}
                    max={2100}
                    placeholder={String(new Date().getFullYear())}
                    {...register("ano", { valueAsNumber: true })}
                    className={errors.ano ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.ano && (
                    <p className="text-xs text-destructive">{errors.ano.message}</p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* ── Documentação ── */}
            <fieldset className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Documentação</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Obrigatório
                </Badge>
              </div>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="matricula">
                    Matrícula <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="matricula"
                    placeholder="Ex: MAT-001"
                    {...register("matricula")}
                    className={errors.matricula ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.matricula && (
                    <p className="text-xs text-destructive">{errors.matricula.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="placa">
                    Placa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="placa"
                    placeholder="Ex: ABC-1D23"
                    {...register("placa")}
                    className={errors.placa ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  />
                  {errors.placa && (
                    <p className="text-xs text-destructive">{errors.placa.message}</p>
                  )}
                </div>
              </div>
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
          <Button type="submit" form="automovel-form" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar Alterações" : "Cadastrar Automóvel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
