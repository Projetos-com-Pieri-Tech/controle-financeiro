import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/ports/UserRepository';
import { createDatabasePool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export class MySQLUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor() {
    this.pool = createDatabasePool();
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = uuidv4(); // Gerar UUID
    const query = `
      INSERT INTO users (id, name, email, password_hash, role_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await this.pool.execute(query, [
      id,
      user.name,
      user.email,
      user.passwordHash,
      user.roleId
    ]);
    
    return this.findById(id) as Promise<User>;
  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, password_hash, role_id, created_at, updated_at, deleted_at
      FROM users
      WHERE id = ? AND deleted_at IS NULL
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      roleId: row.role_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, password_hash, role_id, created_at, updated_at, deleted_at
      FROM users
      WHERE email = ? AND deleted_at IS NULL
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [email]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      roleId: row.role_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    };
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const fields = [];
    const values = [];

    if (user.name !== undefined) {
      fields.push('name = ?');
      values.push(user.name);
    }
    if (user.email !== undefined) {
      fields.push('email = ?');
      values.push(user.email);
    }
    if (user.passwordHash !== undefined) {
      fields.push('password_hash = ?');
      values.push(user.passwordHash);
    }
    if (user.roleId !== undefined) {
      fields.push('role_id = ?');
      values.push(user.roleId);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ? AND deleted_at IS NULL
    `;

    const [result] = await this.pool.execute(query, values);
    const updateResult = result as ResultSetHeader;
    
    if (updateResult.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const query = `
      UPDATE users
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `;

    const [result] = await this.pool.execute(query, [id]);
    const deleteResult = result as ResultSetHeader;
    return deleteResult.affectedRows > 0;
  }

  async findAll(): Promise<User[]> {
    const query = `
      SELECT id, name, email, password_hash, role_id, created_at, updated_at, deleted_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query);
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      roleId: row.role_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    }));
  }
}
