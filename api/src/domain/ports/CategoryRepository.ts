import { Category } from '../entities/category';
import { BaseRepository } from './BaseRepository';

export interface CategoryRepository extends BaseRepository<Category> {
  findByUserId(userId: string | null): Promise<Category[]>; // UUID
  findByName(name: string, userId?: string | null): Promise<Category | null>; // UUID
}