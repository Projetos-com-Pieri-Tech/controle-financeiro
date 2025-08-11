export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  roleId?: string; // UUID opcional
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string; // UUID
    name: string;
    email: string;
    roleId: string; // UUID
    createdAt: Date;
    updatedAt: Date;
  };
  token?: string;
}

export interface TokenPayload {
  userId: string; // UUID
  email: string;
  roleId: string; // UUID
  iat?: number;
  exp?: number;
}
