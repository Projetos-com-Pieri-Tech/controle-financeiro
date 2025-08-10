import { Pool } from 'pg';
import { Account } from '../../../domain/entities/account';
import { AccountRepository } from '../../../domain/ports/AccountRepository';

export class PostgresAccountRepository implements AccountRepository {
  constructor(private pool: Pool) {}

  async findById(id: number): Promise<Account | null> {
    const query = `
      SELECT id, user_id, name, type, initial_balance, created_at, updated_at, deleted_at
      FROM accounts
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findByUserId(userId: number): Promise<Account[]> {
    const query = `
      SELECT id, user_id, name, type, initial_balance, created_at, updated_at, deleted_at
      FROM accounts
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY name
    `;

    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => this.mapToEntity(row));
  }

  async create(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const query = `
      INSERT INTO accounts (user_id, name, type, initial_balance, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, user_id, name, type, initial_balance, created_at, updated_at, deleted_at
    `;

    const values = [account.userId, account.name, account.type, account.initialBalance];
    const result = await this.pool.query(query, values);

    return this.mapToEntity(result.rows[0]);
  }

  async update(id: number, account: Partial<Account>): Promise<Account | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (account.name !== undefined) {
      fields.push(`name = ${paramCount++}`);
      values.push(account.name);
    }
    if (account.type !== undefined) {
      fields.push(`type = ${paramCount++}`);
      values.push(account.type);
    }
    if (account.initialBalance !== undefined) {
      fields.push(`initial_balance = ${paramCount++}`);
      values.push(account.initialBalance);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE accounts
      SET ${fields.join(', ')}
      WHERE id = ${paramCount} AND deleted_at IS NULL
      RETURNING id, user_id, name, type, initial_balance, created_at, updated_at, deleted_at
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE accounts
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(): Promise<Account[]> {
    const query = `
      SELECT id, user_id, name, type, initial_balance, created_at, updated_at, deleted_at
      FROM accounts
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await this.pool.query(query);
    return result.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Account {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type,
      initialBalance: parseFloat(row.initial_balance),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    };
  }
}