"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { automovelService } from "@/services/automovelService";
import { pedidoService } from "@/services/pedidoService";
import { Cliente, Automovel } from "@/types";
import { formatCpf } from "@/lib/formatters";

const pedidoSchema = z.object({
  automovelId: z.string().min(1, "Selecione um automóvel"),
});

type PedidoFormData = z.infer<typeof pedidoSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCliente: Cliente;
  onSuccess: () => void;
}

export function PedidoDialog({ open, onOpenChange, selectedCliente, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const [automoveis, setAutomoveis] = useState<Automovel[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: { automovelId: "" },
  });

  const loadAutomoveis = useCallback(async () => {
    setLoadingData(true);
    try {
      const data = await automovelService.listarDisponiveis();
      setAutomoveis(data ?? []);
    } catch {
      toast.error("Erro ao carregar automóveis", {
        description: "Não foi possível carregar os automóveis disponíveis.",
      });
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadAutomoveis();
      reset({ automovelId: "" });
    }
  }, [open, reset, loadAutomoveis]);

  const onSubmit = async (data: PedidoFormData) => {
    setSaving(true);
    try {
      await pedidoService.criar({
        clienteId: selectedCliente.id,
        automovelId: Number(data.automovelId),
      });
      toast.success("Pedido criado!", {
        description: "Seu pedido de aluguel foi registrado com status CRIADO.",
      });
      onSuccess();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao criar pedido.";
      toast.error("Erro ao criar pedido", { description: message });
    } finally {
      setSaving(false);
    }
  };

  const automovelItems = useMemo(
    () => automoveis.map((a) => ({
      value: String(a.id),
      label: `${a.marca} ${a.modelo} (${a.ano}) — ${a.placa}`,
    })),
    [automoveis]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] !flex !flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Novo Pedido de Aluguel
          </DialogTitle>
          <DialogDescription>
            Confirme o cliente e selecione um automóvel disponível.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6">
          <form
            id="pedido-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* ── Cliente ── */}
            <fieldset className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Cliente</h3>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Selecionado
                </Badge>
              </div>
              <Separator />
              <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">{selectedCliente.nome}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {formatCpf(selectedCliente.cpf)}
                  </p>
                </div>
              </div>
            </fieldset>

            {/* ── Automóvel ── */}
            <fieldset className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Automóvel</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Obrigatório
                </Badge>
              </div>
              <Separator />

              <div className="space-y-1.5">
                <Label>
                  Automóvel disponível <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="automovelId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || null}
                      onValueChange={(val) => field.onChange(val ?? "")}
                      disabled={loadingData}
                      items={automovelItems}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={!!errors.automovelId}
                      >
                        <SelectValue
                          placeholder={
                            loadingData
                              ? "Carregando..."
                              : automoveis.length === 0
                              ? "Nenhum automóvel disponível"
                              : "Selecione um automóvel"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {automoveis.map((a) => (
                          <SelectItem
                            key={a.id}
                            value={String(a.id)}
                            label={`${a.marca} ${a.modelo} (${a.ano}) — ${a.placa}`}
                          >
                            <span className="font-medium">
                              {a.marca} {a.modelo}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              ({a.ano})
                            </span>
                            <span className="text-muted-foreground font-mono text-xs ml-1">
                              — {a.placa}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.automovelId && (
                  <p className="text-xs text-destructive">{errors.automovelId.message}</p>
                )}
                {!loadingData && automoveis.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Todos os automóveis estão com pedidos ativos no momento.
                  </p>
                )}
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
          <Button
            type="submit"
            form="pedido-form"
            disabled={saving || loadingData}
            className="gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Criar Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
