import { Pool } from 'pg';
import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/ports/UserRepository';

export class PostgresUserRepository implements UserRepository {
  constructor(private pool: Pool) {}

  async findById(id: number): Promise<User | null> {
    const query = `
      SELECT id, name, email, password_hash, role_id, created_at, updated_at, deleted_at
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapToEntity(result.rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, password_hash, role_id, created_at, updated_at, deleted_at
      FROM users
      WHERE email = $1 AND deleted_at IS NULL
    `;
    
    const result = await this.pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapToEntity(result.rows[0]);
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password_hash, role_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email, password_hash, role_id, created_at, updated_at, deleted_at
    `;
    
    const values = [user.name, user.email, user.passwordHash, user.roleId];
    const result = await this.pool.query(query, values);
    
    return this.mapToEntity(result.rows[0]);
  }

  async update(id: number, user: Partial<User>): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (user.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(user.name);
    }
    if (user.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(user.email);
    }
    if (user.passwordHash !== undefined) {
      fields.push(`password_hash = $${paramCount++}`);
      values.push(user.passwordHash);
    }
    if (user.roleId !== undefined) {
      fields.push(`role_id = $${paramCount++}`);
      values.push(user.roleId);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ${paramCount} AND deleted_at IS NULL
      RETURNING id, name, email, password_hash, role_id, created_at, updated_at, deleted_at
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE users
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(): Promise<User[]> {
    const query = `
      SELECT id, name, email, password_hash, role_id, created_at, updated_at, deleted_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await this.pool.query(query);
    return result.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      roleId: row.role_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    };
  }
}