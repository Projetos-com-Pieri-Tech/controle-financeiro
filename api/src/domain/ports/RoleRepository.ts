import { Role } from '../entities/role';

export interface RoleRepository {
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  create(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role>;
  update(id: number, role: Partial<Role>): Promise<Role | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<Role[]>;
}