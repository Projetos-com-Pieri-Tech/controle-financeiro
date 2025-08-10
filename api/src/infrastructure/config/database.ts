import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool;

export function createDatabasePool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'controle_financeiro',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Event listeners para logs de conexão
    pool.on('connect', () => {
      console.log('Conectado ao banco de dados PostgreSQL');
    });

    pool.on('error', (err) => {
      console.error('Erro inesperado no cliente do banco de dados:', err);
      process.exit(-1);
    });
  }
  
  return pool;
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = createDatabasePool();
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('Conexão com o banco de dados testada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    return false;
  }
}

export async function closeDatabasePool(): Promise<void> {
  if (pool) {
    await pool.end();
    console.log('Pool de conexões do banco de dados fechado');
  }
}