import { createMySQLPool, testConnection as testMySQLConnection, closeDatabasePool as closeMySQLPool } from './mysql-database';
import dotenv from 'dotenv';

dotenv.config();

export function createDatabasePool() {
  return createMySQLPool();
}

export async function testConnection(): Promise<boolean> {
  return testMySQLConnection();
}

export async function closeDatabasePool(): Promise<void> {
  return closeMySQLPool();
}