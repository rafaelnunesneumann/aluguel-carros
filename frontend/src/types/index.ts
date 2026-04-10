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

// ── Auth ────────────────────────────────────────────────────

export type UserType = "CLIENTE" | "EMPRESA" | "BANCO";

export interface AuthUser {
  token: string;
  userType: UserType;
  userId: number;
  nome: string;
  login: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterClienteRequest {
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  profissao?: string;
  email: string;
  telefone?: string;
  rendimentos?: Rendimento[];
  senha: string;
  confirmSenha: string;
}

export interface RegisterAgenteRequest {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  login: string;
  senha: string;
  confirmSenha: string;
  tipo: "EMPRESA" | "BANCO";
}

// ── Agentes ─────────────────────────────────────────────────

export interface Agente {
  id: number;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  login: string;
  tipo: "EMPRESA" | "BANCO";
  createdAt: string;
}

// ── Contratos ───────────────────────────────────────────────

export interface ContratoResponse {
  id: number;
  dataAssinatura: string;
  tipo: string;
  pedidoId: number;
  automovelId: number;
  automovelMarca: string;
  automovelModelo: string;
  automovelPlaca: string;
}

export interface ContratoCreditoResponse {
  id: number;
  valor: number;
  aprovado: boolean;
  bancoId: number;
  bancoRazaoSocial: string;
  pedidoId: number;
  createdAt: string;
}

