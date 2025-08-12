export interface User {
  id: string; // UUID
  name: string;
  email: string;
  passwordHash: string;
  roleId: string; // UUID
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}