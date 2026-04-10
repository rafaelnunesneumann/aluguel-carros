import api from "@/lib/api";
import type { AuthUser, RegisterClienteRequest, RegisterAgenteRequest } from "@/types";

// Micronaut Security uses /login with username/password fields
export async function login(login: string, senha: string): Promise<AuthUser> {
  const response = await api.post<{
    username: string;
    access_token: string;
    token_type: string;
    roles: string[];
    [key: string]: unknown;
  }>("/login", { username: login, password: senha });

  const data = response.data;

  // Extract custom JWT claims if available; Micronaut embeds them when set
  // via AuthenticationResponse.success(login, roles, attributes)
  // The /login endpoint returns:  { username, access_token, token_type, roles }
  // Custom attributes (userId, userType, nome) are only inside the JWT itself,
  // so we decode the payload.
  const payload = decodeJwtPayload(data.access_token);

  return {
    token: data.access_token,
    userType: (payload["userType"] as string ?? deriveUserType(data.roles)) as AuthUser["userType"],
    userId: Number(payload["userId"] ?? 0),
    nome: (payload["nome"] as string) ?? data.username,
    login: data.username,
  };
}

function deriveUserType(roles: string[]): string {
  if (roles?.includes("ROLE_BANCO")) return "BANCO";
  if (roles?.includes("ROLE_EMPRESA")) return "EMPRESA";
  return "CLIENTE";
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export async function registerCliente(data: RegisterClienteRequest) {
  return api.post("/auth/register", data);
}

export async function registerAgente(data: RegisterAgenteRequest) {
  return api.post("/auth/register/agente", data);
}
