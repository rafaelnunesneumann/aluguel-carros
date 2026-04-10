export type ClienteStatus = "ACTIVE" | "DELETED";

export interface Rendimento {
  id?: number;
  entidadeEmpregadora: string;
  valor: number;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  profissao: string;
  email: string;
  telefone: string;
  rendimentos: Rendimento[];
  status: ClienteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClienteRequest {
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  profissao?: string;
  email: string;
  telefone?: string;
  rendimentos?: Rendimento[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Raw shape returned by Micronaut Data Page serialization
export interface MicronautPage<T> {
  content: T[];
  totalSize: number;
  totalPages: number;
  size: number;
  pageNumber: number;
  numberOfElements: number;
  offset: number;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}

// ── Automóveis ──────────────────────────────────────────────

export interface Automovel {
  id: number;
  matricula: string;
  ano: number;
  marca: string;
  modelo: string;
  placa: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomovelRequest {
  matricula: string;
  ano: number;
  marca: string;
  modelo: string;
  placa: string;
}

// ── Pedidos ─────────────────────────────────────────────────

export type StatusPedido =
  | "CRIADO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REPROVADO"
  | "CANCELADO";

export interface PedidoResponse {
  id: number;
  dataCriacao: string;
  status: StatusPedido;
  dataAtualizacao: string;
  clienteId: number;
  clienteNome: string;
  clienteCpf: string;
  automovelId: number;
  automovelMarca: string;
  automovelModelo: string;
  automovelPlaca: string;
  automovelAno: number;
  automovelMatricula: string;
}

export interface PedidoRequest {
  clienteId: number;
  automovelId: number;
}
