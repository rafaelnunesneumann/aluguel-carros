"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [deleteLoading, setDeleteLoading] = useState(false);
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
    setDeleteLoading(true);
    try {
      await clienteService.deletar(selectedCliente.id);
      toast.success("Cliente excluído", {
        description: `${selectedCliente.nome} foi removido com sucesso.`,
      });
      fetchClientes();
    } catch {
      toast.error("Erro ao excluir cliente");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
      setSelectedCliente(null);
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
        onOpenChange={setDeleteOpen}
        clienteName={selectedCliente?.nome || ""}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
