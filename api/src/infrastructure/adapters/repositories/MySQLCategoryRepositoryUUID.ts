import { CategoryRepository } from '../../../domain/ports/CategoryRepository';
import { Category } from '../../../domain/entities/category';
import mysql, { Pool } from 'mysql2/promise';
import { createDatabasePool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export class MySQLCategoryRepositoryUUID implements CategoryRepository {
  private db: Pool;

  constructor() {
    this.db = createDatabasePool();
  }

  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const id = uuidv4();
    const now = new Date();
    
    await this.db.execute(
      `INSERT INTO categories (id, name, user_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        id, 
        category.name, 
        category.userId || null,
        now,
        now
      ]
    );

    return this.findById(id) as Promise<Category>;
  }

  async findById(id: string): Promise<Category | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    const categories = rows as Category[];
    if (categories.length === 0) {
      return null;
    }

    return this.mapRowToCategory(categories[0]);
  }

  async findAll(): Promise<Category[]> {
    const [rows] = await this.db.execute(
      'SELECT * FROM categories ORDER BY created_at DESC'
    );

    const categories = rows as Category[];
    return categories.map(this.mapRowToCategory);
  }

  async findByUserId(userId: string | null): Promise<Category[]> {
    let query: string;
    let params: any[];

    if (userId === null) {
      // Buscar todas as categorias globais
      query = 'SELECT * FROM categories WHERE user_id IS NULL ORDER BY name';
      params = [];
    } else {
      // Buscar categorias do usuário + categorias globais
      query = `
        SELECT * FROM categories 
        WHERE user_id = ? OR user_id IS NULL 
        ORDER BY user_id ASC, name ASC
      `;
      params = [userId];
    }

    const [rows] = await this.db.execute(query, params);
    const categories = rows as Category[];
    return categories.map(this.mapRowToCategory);
  }

  async findByName(name: string, userId?: string | null): Promise<Category | null> {
    let query: string;
    let params: any[];

    if (userId === undefined || userId === null) {
      // Buscar apenas em categorias globais
      query = 'SELECT * FROM categories WHERE name = ? AND user_id IS NULL';
      params = [name];
    } else {
      // Buscar nas categorias do usuário ou globais
      query = `
        SELECT * FROM categories 
        WHERE name = ? AND (user_id = ? OR user_id IS NULL)
        ORDER BY user_id DESC
        LIMIT 1
      `;
      params = [name, userId];
    }

    const [rows] = await this.db.execute(query, params);
    const categories = rows as Category[];
    
    if (categories.length === 0) {
      return null;
    }

    return this.mapRowToCategory(categories[0]);
  }

  async findByType(type: 'income' | 'expense', userId?: string): Promise<Category[]> {
    // Como a entidade Category atual não tem campo type, retornar todas as categorias
    if (userId === undefined) {
      return this.findByUserId(null);
    } else {
      return this.findByUserId(userId);
    }
  }

  async update(id: string, category: Partial<Category>): Promise<Category | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (category.name !== undefined) {
      updates.push('name = ?');
      values.push(category.name);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = ?');
    values.push(new Date());
    values.push(id);

    await this.db.execute(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Verificar se a categoria está sendo usada em transações
      const [transactionRows] = await this.db.execute(
        'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
        [id]
      );

      const transactionCount = (transactionRows as any[])[0].count;
      if (transactionCount > 0) {
        throw new Error('Cannot delete category that is being used in transactions');
      }

      const [result] = await this.db.execute(
        'DELETE FROM categories WHERE id = ?',
        [id]
      );

      const deleteResult = result as any;
      return deleteResult.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  private mapRowToCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    };
  }
}
