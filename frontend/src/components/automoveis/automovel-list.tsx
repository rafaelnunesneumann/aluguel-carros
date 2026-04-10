"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { AutomovelTable } from "./automovel-table";
import { AutomovelDialog } from "./automovel-dialog";
import { automovelService } from "@/services/automovelService";
import { Automovel } from "@/types";

export function AutomovelList() {
  const [automoveis, setAutomoveis] = useState<Automovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAutomovel, setSelectedAutomovel] = useState<Automovel | null>(null);

  const fetchAutomoveis = useCallback(async () => {
    setLoading(true);
    try {
      const data = await automovelService.listarTodos();
      setAutomoveis(data ?? []);
    } catch {
      toast.error("Erro ao carregar automóveis", {
        description: "Verifique se o servidor está online.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAutomoveis();
  }, [fetchAutomoveis]);

  const filteredAutomoveis = automoveis.filter((a) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase().trim();
    return (
      a.marca.toLowerCase().includes(term) ||
      a.modelo.toLowerCase().includes(term) ||
      a.placa.toLowerCase().includes(term) ||
      a.matricula.toLowerCase().includes(term)
    );
  });

  const handleCreate = () => {
    setSelectedAutomovel(null);
    setDialogOpen(true);
  };

  const handleEdit = (automovel: Automovel) => {
    setSelectedAutomovel(automovel);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (automovel: Automovel) => {
    setSelectedAutomovel(automovel);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAutomovel) return;
    try {
      await automovelService.deletar(selectedAutomovel.id);
      toast.success("Automóvel excluído", {
        description: `${selectedAutomovel.marca} ${selectedAutomovel.modelo} foi removido com sucesso.`,
      });
      fetchAutomoveis();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Erro ao excluir automóvel.";
      toast.error("Erro ao excluir", { description: message });
    } finally {
      setDeleteOpen(false);
      setSelectedAutomovel(null);
    }
  };

  const handleSaveSuccess = () => {
    setDialogOpen(false);
    setSelectedAutomovel(null);
    fetchAutomoveis();
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Automóveis</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie a frota de automóveis disponíveis para aluguel
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Automóvel
        </Button>
      </div>

      {/* ── Search + Table ── */}
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-semibold">Lista de Automóveis</h3>
              <Badge variant="secondary" className="text-xs font-normal tabular-nums">
                {automoveis.length}{" "}
                {automoveis.length === 1 ? "automóvel" : "automóveis"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por marca, modelo ou placa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-[280px]"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchAutomoveis}
                disabled={loading}
                className="h-9 w-9 shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <AutomovelTable
            automoveis={filteredAutomoveis}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        </CardContent>
      </Card>

      {/* ── Dialogs ── */}
      <AutomovelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        automovel={selectedAutomovel}
        onSuccess={handleSaveSuccess}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <AlertDialogTitle>Excluir Automóvel</AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  Tem certeza que deseja excluir{" "}
                  <strong className="text-foreground">
                    {selectedAutomovel?.marca} {selectedAutomovel?.modelo}
                  </strong>
                  ? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
