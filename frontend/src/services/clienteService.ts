import api from "@/lib/api";
import { Cliente, ClienteRequest, MicronautPage, PageResponse } from "@/types";

export const clienteService = {
  async listarTodos(page = 0, size = 10): Promise<PageResponse<Cliente>> {
    const response = await api.get<MicronautPage<Cliente>>("/clientes", {
      params: { page, size, sort: "nome,asc" },
    });
    const raw = response.data;
    return {
      content: raw.content ?? [],
      totalElements: raw.totalSize ?? 0,
      totalPages: raw.totalPages ?? 0,
      size: raw.size ?? size,
      number: raw.pageNumber ?? page,
    };
  },

  async buscarPorId(id: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  async criar(data: ClienteRequest): Promise<Cliente> {
    const response = await api.post<Cliente>("/clientes", data);
    return response.data;
  },

  async atualizar(id: number, data: ClienteRequest): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${id}`, data);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};
