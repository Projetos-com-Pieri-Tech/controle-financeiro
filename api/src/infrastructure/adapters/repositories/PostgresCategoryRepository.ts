import { Pool } from 'pg';
import { Category } from '../../../domain/entities/category';
import { CategoryRepository } from '../../../domain/ports/CategoryRepository';

export class PostgresCategoryRepository implements CategoryRepository {
  constructor(private pool: Pool) {}

  async findById(id: number): Promise<Category | null> {
    const query = `
      SELECT id, user_id, name, created_at, updated_at, deleted_at
      FROM categories
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findByUserId(userId: number | null): Promise<Category[]> {
    const query = userId === null
      ? `SELECT id, user_id, name, created_at, updated_at, deleted_at
         FROM categories
         WHERE user_id IS NULL AND deleted_at IS NULL
         ORDER BY name`
      : `SELECT id, user_id, name, created_at, updated_at, deleted_at
         FROM categories
         WHERE user_id = $1 AND deleted_at IS NULL
         ORDER BY name`;

    const result = userId === null
      ? await this.pool.query(query)
      : await this.pool.query(query, [userId]);

    return result.rows.map(row => this.mapToEntity(row));
  }

  async findByName(name: string, userId?: number | null): Promise<Category | null> {
    const query = userId === undefined
      ? `SELECT id, user_id, name, created_at, updated_at, deleted_at
         FROM categories
         WHERE name = $1 AND deleted_at IS NULL`
      : userId === null
      ? `SELECT id, user_id, name, created_at, updated_at, deleted_at
         FROM categories
         WHERE name = $1 AND user_id IS NULL AND deleted_at IS NULL`
      : `SELECT id, user_id, name, created_at, updated_at, deleted_at
         FROM categories
         WHERE name = $1 AND user_id = $2 AND deleted_at IS NULL`;

    const values = userId === undefined
      ? [name]
      : userId === null
      ? [name]
      : [name, userId];

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const query = `
      INSERT INTO categories (user_id, name, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id, user_id, name, created_at, updated_at, deleted_at
    `;

    const values = [category.userId, category.name];
    const result = await this.pool.query(query, values);

    return this.mapToEntity(result.rows[0]);
  }

  async update(id: number, category: Partial<Category>): Promise<Category | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (category.name !== undefined) {
      fields.push(`name = ${paramCount++}`);
      values.push(category.name);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE categories
      SET ${fields.join(', ')}
      WHERE id = ${paramCount} AND deleted_at IS NULL
      RETURNING id, user_id, name, created_at, updated_at, deleted_at
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE categories
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(): Promise<Category[]> {
    const query = `
      SELECT id, user_id, name, created_at, updated_at, deleted_at
      FROM categories
      WHERE deleted_at IS NULL
      ORDER BY user_id NULLS FIRST, name
    `;

    const result = await this.pool.query(query);
    return result.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Category {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    };
  }
}