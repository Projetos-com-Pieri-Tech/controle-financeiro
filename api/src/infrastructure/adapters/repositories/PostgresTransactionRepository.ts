import { Pool } from 'pg';
import { Transaction } from '../../../domain/entities/transaction';
import { TransactionRepository, TransactionFilters } from '../../../domain/ports/TransactionRepository';

export class PostgresTransactionRepository implements TransactionRepository {
  constructor(private pool: Pool) {}

  async findById(id: number): Promise<Transaction | null> {
    const query = `
      SELECT id, user_id, account_id, category_id, description, amount, type,
             transaction_date, is_paid, created_at, updated_at, deleted_at
      FROM transactions
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findByUserId(userId: number): Promise<Transaction[]> {
    const query = `
      SELECT id, user_id, account_id, category_id, description, amount, type,
             transaction_date, is_paid, created_at, updated_at, deleted_at
      FROM transactions
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY transaction_date DESC, created_at DESC
    `;

    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => this.mapToEntity(row));
  }

  async findByAccountId(accountId: number): Promise<Transaction[]> {
    const query = `
      SELECT id, user_id, account_id, category_id, description, amount, type,
             transaction_date, is_paid, created_at, updated_at, deleted_at
      FROM transactions
      WHERE account_id = $1 AND deleted_at IS NULL
      ORDER BY transaction_date DESC, created_at DESC
    `;

    const result = await this.pool.query(query, [accountId]);
    return result.rows.map(row => this.mapToEntity(row));
  }

  async findByCategoryId(categoryId: number): Promise<Transaction[]> {
    const query = `
      SELECT id, user_id, account_id, category_id, description, amount, type,
             transaction_date, is_paid, created_at, updated_at, deleted_at
      FROM transactions
      WHERE category_id = $1 AND deleted_at IS NULL
      ORDER BY transaction_date DESC, created_at DESC
    `;

    const result = await this.pool.query(query, [categoryId]);
    return result.rows.map(row => this.mapToEntity(row));
  }

  async findByFilters(filters: TransactionFilters): Promise<Transaction[]> {
    const conditions = ['deleted_at IS NULL'];
    const values = [];
    let paramCount = 1;

    if (filters.userId !== undefined) {
      conditions.push(`user_id = ${paramCount++}`);
      values.push(filters.userId);
    }
    if (filters.accountId !== undefined) {
      conditions.push(`account_id = ${paramCount++}`);
      values.push(filters.accountId);
    }
    if (filters.categoryId !== undefined) {
      conditions.push(`category_id = ${paramCount++}`);
      values.push(filters.categoryId);
    }
    if (filters.type !== undefined) {
      conditions.push(`type = ${paramCount++}`);
      values.push(filters.type);
    }
    if (filters.startDate !== undefined) {
      conditions.push(`transaction_date >= ${paramCount++}`);
      values.push(filters.startDate);
    }
    if (filters.endDate !== undefined) {
      conditions.push(`transaction_date <= ${paramCount++}`);
      values.push(filters.endDate);
    }
    if (filters.isPaid !== undefined) {
      conditions.push(`is_paid = ${paramCount++}`);
      values.push(filters.isPaid);
    }

    const query = `
      SELECT id, user_id, account_id, category_id, description, amount, type,
             transaction_date, is_paid, created_at, updated_at, deleted_at
      FROM transactions
      WHERE ${conditions.join(' AND ')}
      ORDER BY transaction_date DESC, created_at DESC
    `;

    const result = await this.pool.query(query, values);
    return result.rows.map(row => this.mapToEntity(row));
  }

  async create(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const query = `
      INSERT INTO transactions (user_id, account_id, category_id, description, amount, type,
                               transaction_date, is_paid, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, user_id, account_id, category_id, description, amount, type,
                transaction_date, is_paid, created_at, updated_at, deleted_at
    `;

    const values = [
      transaction.userId,
      transaction.accountId,
      transaction.categoryId,
      transaction.description,
      transaction.amount,
      transaction.type,
      transaction.transactionDate,
      transaction.isPaid
    ];

    const result = await this.pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async update(id: number, transaction: Partial<Transaction>): Promise<Transaction | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (transaction.accountId !== undefined) {
      fields.push(`account_id = ${paramCount++}`);
      values.push(transaction.accountId);
    }
    if (transaction.categoryId !== undefined) {
      fields.push(`category_id = ${paramCount++}`);
      values.push(transaction.categoryId);
    }
    if (transaction.description !== undefined) {
      fields.push(`description = ${paramCount++}`);
      values.push(transaction.description);
    }
    if (transaction.amount !== undefined) {
      fields.push(`amount = ${paramCount++}`);
      values.push(transaction.amount);
    }
    if (transaction.type !== undefined) {
      fields.push(`type = ${paramCount++}`);
      values.push(transaction.type);
    }
    if (transaction.transactionDate !== undefined) {
      fields.push(`transaction_date = ${paramCount++}`);
      values.push(transaction.transactionDate);
    }
    if (transaction.isPaid !== undefined) {
      fields.push(`is_paid = ${paramCount++}`);
      values.push(transaction.isPaid);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE transactions
      SET ${fields.join(', ')}
      WHERE id = ${paramCount} AND deleted_at IS NULL
      RETURNING id, user_id, account_id, category_id, description, amount, type,
                transaction_date, is_paid, created_at, updated_at, deleted_at
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE transactions
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(): Promise<Transaction[]> {
    const query = `
      SELECT id, user_id, account_id, category_id, description, amount, type,
             transaction_date, is_paid, created_at, updated_at, deleted_at
      FROM transactions
      WHERE deleted_at IS NULL
      ORDER BY transaction_date DESC, created_at DESC
    `;

    const result = await this.pool.query(query);
    return result.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Transaction {
    return {
      id: row.id,
      userId: row.user_id,
      accountId: row.account_id,
      categoryId: row.category_id,
      description: row.description,
      amount: parseFloat(row.amount),
      type: row.type,
      transactionDate: row.transaction_date,
      isPaid: row.is_paid,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    };
  }
}