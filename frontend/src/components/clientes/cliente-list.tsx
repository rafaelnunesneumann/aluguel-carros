"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClienteTable } from "./cliente-table";
import { ClienteDialog } from "./cliente-dialog";
import { ClienteDetail } from "./cliente-detail";
import { DeleteDialog } from "./delete-dialog";
import { clienteService } from "@/services/clienteService";
import { Cliente } from "@/types";

export function ClienteList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [blockedOpen, setBlockedOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clienteService.listarTodos(page, 10);
      setClientes(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
    } catch {
      toast.error("Erro ao carregar clientes", {
        description: "Verifique se o servidor está online.",
      });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const filteredClientes = clientes.filter((c) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase().trim();
    const digits = search.replace(/\D/g, "");

    if (c.nome.toLowerCase().includes(term)) return true;
    if (digits.length > 0 && c.cpf.includes(digits)) return true;
    if (c.email?.toLowerCase().includes(term)) return true;

    return false;
  });

  const handleCreate = () => {
    setSelectedCliente(null);
    setDialogOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDialogOpen(true);
  };

  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDetailOpen(true);
  };

  const handleDeleteRequest = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCliente) return;
    setIsDeleting(true);
    try {
      await clienteService.deletar(selectedCliente.id);
      toast.success("Cliente excluído", {
        description: `${selectedCliente.nome} foi removido com sucesso.`,
      });
      fetchClientes();
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message || "Erro ao excluir cliente.";
      if (message.startsWith("ALUGUEL_ATIVO")) {
        setDeleteOpen(false);
        setBlockedOpen(true);
        return;
      }
      toast.error("Erro ao excluir cliente", { description: message });
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleSaveSuccess = () => {
    setDialogOpen(false);
    setSelectedCliente(null);
    fetchClientes();
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-card-enter">
        <div className="space-y-1">
          <div className="divider-red w-8 mb-3" />
          <h2 className="font-heading text-3xl font-bold tracking-wide">Clientes</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os clientes cadastrados no sistema
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 btn-shimmer border-0 font-heading font-semibold tracking-wider uppercase text-sm h-10">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* ── Search + Table ───────────────────────────────── */}
      <div className="animate-card-enter animation-delay-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading text-base font-semibold tracking-wide">Lista de Clientes</h3>
            <span className="inline-flex items-center rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-xs font-medium tabular-nums">
              {totalElements} {totalElements === 1 ? "cliente" : "clientes"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-[280px] bg-card border-border/60 h-9"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchClientes}
              disabled={loading}
              className="h-9 w-9 shrink-0 border-border/60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <ClienteTable
          clientes={filteredClientes}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />

          {/* ── Pagination ─────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
      </div>

      {/* ── Dialogs ──────────────────────────────────────── */}
      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cliente={selectedCliente}
        onSuccess={handleSaveSuccess}
      />

      <ClienteDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        cliente={selectedCliente}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={(open) => { if (!isDeleting) setDeleteOpen(open); }}
        clienteName={selectedCliente?.nome || ""}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Modal de bloqueio — aluguel ativo */}
      <AlertDialog open={blockedOpen} onOpenChange={(open) => { setBlockedOpen(open); if (!open) setSelectedCliente(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <AlertDialogTitle>Exclusão não permitida</AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  O cliente{" "}
                  <strong className="text-foreground">{selectedCliente?.nome}</strong>{" "}
                  possui um <strong className="text-foreground">aluguel ativo</strong>. Encerre o contrato antes de excluí-lo.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction onClick={() => { setBlockedOpen(false); setSelectedCliente(null); }}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
