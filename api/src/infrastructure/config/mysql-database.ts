import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool;

export function createMySQLPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'controle_financeiro',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'mysql',
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
    });

    // Event listeners para logs de conexão
    console.log('Pool de conexões MySQL criado');
  }
  
  return pool;
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = createMySQLPool();
    const connection = await pool.getConnection();
    await connection.execute('SELECT NOW() as currentTime');
    connection.release();
    console.log('Conexão com o banco de dados MySQL testada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados MySQL:', error);
    return false;
  }
}

export async function closeDatabasePool(): Promise<void> {
  if (pool) {
    await pool.end();
    console.log('Pool de conexões MySQL fechado');
  }
}
