import api from "@/lib/api";
import { Cliente, ClienteRequest, PageResponse } from "@/types";

export const clienteService = {
  async listarTodos(page = 0, size = 10): Promise<PageResponse<Cliente>> {
    const response = await api.get<PageResponse<Cliente>>("/clientes", {
      params: { page, size, sort: "nome,asc" },
    });
    return response.data;
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
