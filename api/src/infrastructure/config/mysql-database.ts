import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: mysql.Pool | null = null;
  private isConnected = false;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  getPool(): mysql.Pool {
    if (!this.pool || !this.isConnected) {
      this.createPool();
    }
    return this.pool!;
  }

  private createPool(): void {
    if (this.pool) {
      return;
    }

    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'controle_financeiro',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'mysql',
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
    });

    this.isConnected = true;
  }

  async closePool(): Promise<void> {
    if (this.pool && this.isConnected) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
    }
  }
}

export function createMySQLPool(): mysql.Pool {
  return DatabaseConnection.getInstance().getPool();
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = createMySQLPool();
    const connection = await pool.getConnection();
    await connection.execute('SELECT NOW() as currentTime');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados MySQL:', error);
    return false;
  }
}

export async function closeDatabasePool(): Promise<void> {
  await DatabaseConnection.getInstance().closePool();
}
