import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { createDatabasePool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

/**
 * Classe base abstrata para repositórios MySQL com funcionalidades comuns
 */
export abstract class MySQLBaseRepository<T> {
  protected readonly pool: Pool;

  constructor() {
    this.pool = createDatabasePool();
  }

  /**
   * Gera um UUID único
   */
  protected generateId(): string {
    return uuidv4();
  }

  /**
   * Executa uma query de inserção genérica
   */
  protected async executeInsert(query: string, params: any[]): Promise<ResultSetHeader> {
    const [result] = await this.pool.execute<ResultSetHeader>(query, params);
    return result;
  }

  /**
   * Executa uma query de busca genérica
   */
  protected async executeSelect<R extends RowDataPacket>(
    query: string, 
    params: any[] = []
  ): Promise<R[]> {
    const [rows] = await this.pool.execute<R[]>(query, params);
    return rows;
  }

  /**
   * Executa uma query de atualização genérica
   */
  protected async executeUpdate(query: string, params: any[]): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(query, params);
    return result.affectedRows > 0;
  }

  /**
   * Executa uma query de exclusão lógica genérica
   */
  protected async executeSoftDelete(tableName: string, id: string): Promise<boolean> {
    const query = `UPDATE ${tableName} SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;
    return this.executeUpdate(query, [id]);
  }

  /**
   * Busca um registro por ID com exclusão lógica
   */
  protected async findByIdBase(
    tableName: string, 
    id: string, 
    mapper: (row: RowDataPacket) => T
  ): Promise<T | null> {
    const query = `SELECT * FROM ${tableName} WHERE id = ? AND deleted_at IS NULL`;
    const rows = await this.executeSelect<RowDataPacket>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return mapper(rows[0]);
  }

  /**
   * Busca múltiplos registros com condições
   */
  protected async findManyBase(
    tableName: string, 
    whereClause: string, 
    params: any[], 
    mapper: (row: RowDataPacket) => T
  ): Promise<T[]> {
    const query = `SELECT * FROM ${tableName} WHERE ${whereClause} AND deleted_at IS NULL`;
    const rows = await this.executeSelect<RowDataPacket>(query, params);
    
    return rows.map(mapper);
  }

  /**
   * Conta registros com condições
   */
  protected async countBase(
    tableName: string, 
    whereClause: string = '1=1', 
    params: any[] = []
  ): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause} AND deleted_at IS NULL`;
    const rows = await this.executeSelect<RowDataPacket>(query, params);
    
    return rows[0]?.count || 0;
  }

  /**
   * Método abstrato para mapear row do banco para entidade
   */
  protected abstract mapRowToEntity(row: RowDataPacket): T;
}
