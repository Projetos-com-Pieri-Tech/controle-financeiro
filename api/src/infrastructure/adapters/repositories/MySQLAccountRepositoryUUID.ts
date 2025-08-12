import { RowDataPacket } from 'mysql2/promise';
import { Account } from '../../../domain/entities/account';
import { AccountRepository } from '../../../domain/ports/AccountRepository';
import { MySQLBaseRepository } from './MySQLBaseRepository';

export class MySQLAccountRepository extends MySQLBaseRepository<Account> implements AccountRepository {

  async create(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const id = this.generateId();
    const query = `
      INSERT INTO accounts (id, user_id, name, type, initial_balance, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await this.executeInsert(query, [
      id,
      account.userId,
      account.name,
      account.type,
      account.initialBalance || 0
    ]);
    
    return this.findById(id) as Promise<Account>;
  }

  async findById(id: string): Promise<Account | null> {
    return this.findByIdBase('accounts', id, this.mapRowToEntity.bind(this));
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const query = `SELECT * FROM accounts WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`;
    const rows = await this.executeSelect<RowDataPacket>(query, [userId]);
    return rows.map(row => this.mapRowToEntity(row));
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

    const query = `UPDATE accounts SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    const success = await this.executeUpdate(query, values);
    
    return success ? this.findById(id) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.executeSoftDelete('accounts', id);
  }

  async findAll(): Promise<Account[]> {
    const query = `SELECT * FROM accounts WHERE deleted_at IS NULL ORDER BY created_at DESC`;
    const rows = await this.executeSelect<RowDataPacket>(query);
    return rows.map(row => this.mapRowToEntity(row));
  }

  protected mapRowToEntity(row: RowDataPacket): Account {
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
}
