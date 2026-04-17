"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [deleteLoading, setDeleteLoading] = useState(false);
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
    setDeleteLoading(true);
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
      setDeleteLoading(false);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-card-enter">
        <div className="space-y-1">
          <div className="divider-red w-8 mb-3" />
          <h2 className="font-heading text-3xl font-bold tracking-wide">Automóveis</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie a frota de automóveis disponíveis para aluguel
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 btn-shimmer border-0 font-heading font-semibold tracking-wider uppercase text-sm h-10">
          <Plus className="h-4 w-4" />
          Novo Automóvel
        </Button>
      </div>

      {/* ── Search + Grid ── */}
      <div className="space-y-4 animate-card-enter animation-delay-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading text-base font-semibold tracking-wide">Frota de Veículos</h3>
            <span className="inline-flex items-center rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-xs font-medium tabular-nums">
              {automoveis.length}{" "}
              {automoveis.length === 1 ? "veículo" : "veículos"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por marca, modelo ou placa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-[280px] bg-card border-border/60 h-9"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchAutomoveis}
              disabled={loading}
              className="h-9 w-9 shrink-0 border-border/60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <AutomovelTable
          automoveis={filteredAutomoveis}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </div>

      {/* ── Dialogs ── */}
      <AutomovelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        automovel={selectedAutomovel}
        onSuccess={handleSaveSuccess}
      />

      <AlertDialog open={deleteOpen} onOpenChange={(v) => { if (!deleteLoading) setDeleteOpen(v); }}>
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
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-destructive text-white hover:bg-destructive/90 disabled:opacity-70"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Sim, excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
