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
  createdAt: string;
  updatedAt: string;
}

export interface ClienteRequest {
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  profissao?: string;
  email?: string;
  telefone?: string;
  rendimentos?: Rendimento[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}
