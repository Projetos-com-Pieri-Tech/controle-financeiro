import { CategoryRepository } from '../../../domain/ports/CategoryRepository';
import { Category } from '../../../domain/entities/category';
import { RowDataPacket } from 'mysql2/promise';
import { MySQLBaseRepository } from './MySQLBaseRepository';

export class MySQLCategoryRepositoryUUID extends MySQLBaseRepository<Category> implements CategoryRepository {

  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const id = this.generateId();
    const query = `
      INSERT INTO categories (id, name, user_id, created_at, updated_at) 
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    
    await this.executeInsert(query, [
      id, 
      category.name, 
      category.userId || null
    ]);

    return this.findById(id) as Promise<Category>;
  }

  async findById(id: string): Promise<Category | null> {
    return this.findByIdBase('categories', id, this.mapRowToEntity.bind(this));
  }

  async findAll(): Promise<Category[]> {
    const query = `SELECT * FROM categories ORDER BY created_at DESC`;
    const rows = await this.executeSelect<RowDataPacket>(query);
    return rows.map(row => this.mapRowToEntity(row));
  }

  async findByUserId(userId: string | null): Promise<Category[]> {
    let query: string;
    let params: any[];

    if (userId === null) {
      query = 'SELECT * FROM categories WHERE user_id IS NULL ORDER BY name';
      params = [];
    } else {
      query = `
        SELECT * FROM categories 
        WHERE user_id = ? OR user_id IS NULL 
        ORDER BY user_id ASC, name ASC
      `;
      params = [userId];
    }

    const rows = await this.executeSelect<RowDataPacket>(query, params);
    return rows.map(row => this.mapRowToEntity(row));
  }

  async findByName(name: string, userId?: string | null): Promise<Category | null> {
    let query: string;
    let params: any[];

    if (userId === undefined || userId === null) {
      query = 'SELECT * FROM categories WHERE name = ? AND user_id IS NULL';
      params = [name];
    } else {
      query = `
        SELECT * FROM categories 
        WHERE name = ? AND (user_id = ? OR user_id IS NULL)
        ORDER BY user_id DESC
        LIMIT 1
      `;
      params = [name, userId];
    }

    const rows = await this.executeSelect<RowDataPacket>(query, params);
    return rows.length > 0 ? this.mapRowToEntity(rows[0]) : null;
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

    updates.push('updated_at = NOW()');
    values.push(id);

    const query = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
    const success = await this.executeUpdate(query, values);
    
    return success ? this.findById(id) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Verificar se a categoria está sendo usada em transações
      const transactionRows = await this.executeSelect<RowDataPacket>(
        'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
        [id]
      );

      const transactionCount = transactionRows[0].count;
      if (transactionCount > 0) {
        throw new Error('Cannot delete category that is being used in transactions');
      }

      const query = 'DELETE FROM categories WHERE id = ?';
      const [result] = await this.pool.execute(query, [id]);
      const deleteResult = result as any;
      return deleteResult.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  protected mapRowToEntity(row: RowDataPacket): Category {
    return {
      id: row.id,
      name: row.name,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    };
  }
}
