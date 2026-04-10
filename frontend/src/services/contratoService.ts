import api from "@/lib/api";
import type { ContratoResponse, ContratoCreditoResponse } from "@/types";

export async function buscarContratoPorPedido(pedidoId: number): Promise<ContratoResponse> {
  const response = await api.get<ContratoResponse>(`/contratos/pedido/${pedidoId}`);
  return response.data;
}

export async function buscarCreditoPorPedido(pedidoId: number): Promise<ContratoCreditoResponse> {
  const response = await api.get<ContratoCreditoResponse>(`/contratos/pedido/${pedidoId}/credito`);
  return response.data;
}

export async function concederCredito(pedidoId: number, valor: number): Promise<ContratoCreditoResponse> {
  const response = await api.post<ContratoCreditoResponse>(`/pedidos/${pedidoId}/credito`, { valor });
  return response.data;
}
