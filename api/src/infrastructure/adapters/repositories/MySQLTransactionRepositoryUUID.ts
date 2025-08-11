import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { Transaction } from '../../../domain/entities/transaction';
import { TransactionRepository, TransactionFilters } from '../../../domain/ports/TransactionRepository';
import { createDatabasePool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export class MySQLTransactionRepository implements TransactionRepository {
  private readonly pool: Pool;

  constructor() {
    this.pool = createDatabasePool();
  }

  async create(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const id = uuidv4();
    const query = `
      INSERT INTO transactions (id, user_id, account_id, category_id, amount, description, type, transaction_date, is_paid, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await this.pool.execute(query, [
      id,
      transaction.userId,
      transaction.accountId,
      transaction.categoryId,
      transaction.amount,
      transaction.description,
      transaction.type,
      transaction.transactionDate,
      transaction.isPaid
    ]);

    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to create transaction');
    }
    return created;
  }

  async findById(id: string): Promise<Transaction | null> {
    const query = `
      SELECT t.*, u.name as user_name, a.name as account_name, c.name as category_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN accounts a ON t.account_id = a.id  
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    return this.mapRowToTransaction(rows[0]);
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const query = `
      SELECT t.*, u.name as user_name, a.name as account_name, c.name as category_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [userId]);
    return rows.map(row => this.mapRowToTransaction(row));
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const query = `
      SELECT t.*, u.name as user_name, a.name as account_name, c.name as category_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.account_id = ?
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [accountId]);
    return rows.map(row => this.mapRowToTransaction(row));
  }

  async findByCategoryId(categoryId: string): Promise<Transaction[]> {
    const query = `
      SELECT t.*, u.name as user_name, a.name as account_name, c.name as category_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.category_id = ?
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [categoryId]);
    return rows.map(row => this.mapRowToTransaction(row));
  }

  async findByFilters(filters: TransactionFilters): Promise<Transaction[]> {
    let query = `
      SELECT t.*, u.name as user_name, a.name as account_name, c.name as category_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];

    if (filters.userId) {
      query += ' AND t.user_id = ?';
      queryParams.push(filters.userId);
    }

    if (filters.accountId) {
      query += ' AND t.account_id = ?';
      queryParams.push(filters.accountId);
    }

    if (filters.categoryId) {
      query += ' AND t.category_id = ?';
      queryParams.push(filters.categoryId);
    }

    if (filters.type) {
      query += ' AND t.type = ?';
      queryParams.push(filters.type);
    }

    if (filters.startDate) {
      query += ' AND t.transaction_date >= ?';
      queryParams.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND t.transaction_date <= ?';
      queryParams.push(filters.endDate);
    }

    if (filters.isPaid !== undefined) {
      query += ' AND t.is_paid = ?';
      queryParams.push(filters.isPaid);
    }

    query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';

    const [rows] = await this.pool.execute<RowDataPacket[]>(query, queryParams);
    return rows.map(row => this.mapRowToTransaction(row));
  }

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (transaction.accountId !== undefined) {
      updates.push('account_id = ?');
      values.push(transaction.accountId);
    }
    if (transaction.categoryId !== undefined) {
      updates.push('category_id = ?');
      values.push(transaction.categoryId);
    }
    if (transaction.amount !== undefined) {
      updates.push('amount = ?');
      values.push(transaction.amount);
    }
    if (transaction.description !== undefined) {
      updates.push('description = ?');
      values.push(transaction.description);
    }
    if (transaction.type !== undefined) {
      updates.push('type = ?');
      values.push(transaction.type);
    }
    if (transaction.transactionDate !== undefined) {
      updates.push('transaction_date = ?');
      values.push(transaction.transactionDate);
    }
    if (transaction.isPaid !== undefined) {
      updates.push('is_paid = ?');
      values.push(transaction.isPaid);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    const query = `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`;
    
    await this.pool.execute(query, values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM transactions WHERE id = ?';
    const [result] = await this.pool.execute<ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }

  async findAll(): Promise<Transaction[]> {
    const query = `
      SELECT t.*, u.name as user_name, a.name as account_name, c.name as category_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `;
    
    const [rows] = await this.pool.execute<RowDataPacket[]>(query);
    return rows.map(row => this.mapRowToTransaction(row));
  }

  private mapRowToTransaction(row: RowDataPacket): Transaction {
    return {
      id: row.id,
      userId: row.user_id,
      accountId: row.account_id,
      categoryId: row.category_id,
      amount: parseFloat(row.amount),
      description: row.description,
      type: row.type,
      transactionDate: new Date(row.transaction_date),
      isPaid: Boolean(row.is_paid),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    };
  }
}
