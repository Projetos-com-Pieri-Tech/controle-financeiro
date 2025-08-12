export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleId?: string; // UUID
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  roleId?: string; // UUID
}

export interface UpdateUserRoleRequest {
  roleId: string; // UUID
}

export interface UserResponse {
  id: string; // UUID
  name: string;
  email: string;
  roleId: string; // UUID
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface UserListResponse {
  users: UserResponse[];
  total: number;
}
