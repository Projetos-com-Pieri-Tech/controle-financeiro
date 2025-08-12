import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

/**
 * Utilitário para adaptação UUID em repositories MySQL
 */
export class MySQLUuidAdapter {
  /**
   * Converte insertId para UUID string ou gera novo UUID
   */
  static handleInsertId(): string {
    // Em produção, o banco gerará UUID automaticamente
    // Para desenvolvimento, vamos gerar UUID
    return uuidv4();
  }

  /**
   * Converte parâmetro ID para número quando necessário (temporário)
   */
  static parseId(id: string | number): number {
    if (typeof id === 'string') {
      // Para UUID, vamos usar hash simples temporário
      return Math.abs(id.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)) % 999999;
    }
    return id;
  }

  /**
   * Executa query com adaptação de parâmetros
   */
  static async executeQuery(
    pool: mysql.Pool, 
    query: string, 
    params: any[] = []
  ): Promise<[any, mysql.FieldPacket[]]> {
    // Converter UUIDs para números temporariamente se necessário
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const adaptedParams = params.map(param => {
      if (typeof param === 'string' && uuidRegex.exec(param)) {
        return this.parseId(param);
      }
      return param;
    });

    return pool.execute(query, adaptedParams);
  }
}
