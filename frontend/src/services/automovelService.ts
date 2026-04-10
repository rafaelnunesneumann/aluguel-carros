import api from "@/lib/api";
import { Automovel, AutomovelRequest } from "@/types";

export const automovelService = {
  async listarTodos(): Promise<Automovel[]> {
    const response = await api.get<Automovel[]>("/automoveis");
    return response.data;
  },

  async listarDisponiveis(): Promise<Automovel[]> {
    const response = await api.get<Automovel[]>("/automoveis/disponiveis");
    return response.data;
  },

  async buscarPorId(id: number): Promise<Automovel> {
    const response = await api.get<Automovel>(`/automoveis/${id}`);
    return response.data;
  },

  async criar(data: AutomovelRequest): Promise<Automovel> {
    const response = await api.post<Automovel>("/automoveis", data);
    return response.data;
  },

  async atualizar(id: number, data: AutomovelRequest): Promise<Automovel> {
    const response = await api.put<Automovel>(`/automoveis/${id}`, data);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/automoveis/${id}`);
  },
};
