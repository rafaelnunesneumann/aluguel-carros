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
