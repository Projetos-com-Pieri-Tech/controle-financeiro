import { Role } from '../entities/role';
import { BaseRepository } from './BaseRepository';

export interface RoleRepository extends BaseRepository<Role> {
  findByName(name: string): Promise<Role | null>;
}