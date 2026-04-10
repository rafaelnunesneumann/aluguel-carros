import api from "@/lib/api";
import { PedidoRequest, PedidoResponse } from "@/types";

export const pedidoService = {
  async criar(data: PedidoRequest): Promise<PedidoResponse> {
    const response = await api.post<PedidoResponse>("/pedidos", data);
    return response.data;
  },

  async listarPorCliente(clienteId: number): Promise<PedidoResponse[]> {
    const response = await api.get<PedidoResponse[]>(`/pedidos/cliente/${clienteId}`);
    return response.data;
  },

  async buscarPorId(id: number): Promise<PedidoResponse> {
    const response = await api.get<PedidoResponse>(`/pedidos/${id}`);
    return response.data;
  },

  async cancelar(id: number): Promise<PedidoResponse> {
    const response = await api.delete<PedidoResponse>(`/pedidos/${id}`);
    return response.data;
  },
};
