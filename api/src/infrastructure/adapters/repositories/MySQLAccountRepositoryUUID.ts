import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { Account } from '../../../domain/entities/account';
import { AccountRepository } from '../../../domain/ports/AccountRepository';
import { createDatabasePool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export class MySQLAccountRepository implements AccountRepository {
  private readonly pool: Pool;

  constructor() {
    this.pool = createDatabasePool();
  }

  async create(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const id = uuidv4(); // Gerar UUID
    const query = `
      INSERT INTO accounts (id, user_id, name, type, initial_balance, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await this.pool.execute(query, [
      id,
      account.userId,
      account.name,
      account.type,
      account.initialBalance || 0
    ]);
    
    return this.findById(id) as Promise<Account>;
  }

  async findById(id: string): Promise<Account | null> {
    const query = `
      SELECT id, user_id, name, type, initial_balance, created_at, updated_at, deleted_at
      FROM accounts
      WHERE id = ? AND deleted_at IS NULL
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type,
      initialBalance: parseFloat(row.initial_balance),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    };
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const query = `
      SELECT id, user_id, name, type, initial_balance, created_at, updated_at, deleted_at
      FROM accounts
      WHERE user_id = ? AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [userId]);
    
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type,
      initialBalance: parseFloat(row.initial_balance),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    }));
  }

  async update(id: string, account: Partial<Account>): Promise<Account | null> {
    const fields = [];
    const values = [];

    if (account.name !== undefined) {
      fields.push('name = ?');
      values.push(account.name);
    }
    if (account.type !== undefined) {
      fields.push('type = ?');
      values.push(account.type);
    }
    if (account.initialBalance !== undefined) {
      fields.push('initial_balance = ?');
      values.push(account.initialBalance);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const query = `
      UPDATE accounts
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
      UPDATE accounts
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `;

    const [result] = await this.pool.execute(query, [id]);
    const deleteResult = result as ResultSetHeader;
    return deleteResult.affectedRows > 0;
  }

  async findAll(): Promise<Account[]> {
    const query = `
      SELECT id, user_id, name, type, initial_balance, created_at, updated_at, deleted_at
      FROM accounts
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query);
    
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type,
      initialBalance: parseFloat(row.initial_balance),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    }));
  }
}
