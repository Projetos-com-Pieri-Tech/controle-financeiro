import { RowDataPacket, Pool } from 'mysql2/promise';
import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/ports/repositories/UserRepository';
import { MySQLBaseRepository } from './MySQLBaseRepository';

export class MySQLUserRepository extends MySQLBaseRepository<User> implements UserRepository {

  constructor(pool: Pool) {
    super(pool);
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = this.generateId();
    const query = `
      INSERT INTO users (id, name, email, password_hash, role_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await this.executeInsert(query, [
      id,
      user.name,
      user.email,
      user.passwordHash,
      user.roleId
    ]);
    
    return this.findById(id) as Promise<User>;
  }

  async findById(id: string): Promise<User | null> {
    return this.findByIdBase('users', id, this.mapRowToEntity.bind(this));
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = ? AND deleted_at IS NULL`;
    const rows = await this.executeSelect<RowDataPacket>(query, [email]);
    return rows.length > 0 ? this.mapRowToEntity(rows[0]) : null;
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

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    const success = await this.executeUpdate(query, values);
    
    return success ? this.findById(id) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.executeSoftDelete('users', id);
  }

  async findAll(): Promise<User[]> {
    const query = `SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC`;
    const rows = await this.executeSelect<RowDataPacket>(query);
    return rows.map(row => this.mapRowToEntity(row));
  }

  protected mapRowToEntity(row: RowDataPacket): User {
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
}
