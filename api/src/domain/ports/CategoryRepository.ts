import { Category } from '../entities/category';

export interface CategoryRepository {
  findById(id: number): Promise<Category | null>;
  findByUserId(userId: number | null): Promise<Category[]>;
  findByName(name: string, userId?: number | null): Promise<Category | null>;
  create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>;
  update(id: number, category: Partial<Category>): Promise<Category | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<Category[]>;
}