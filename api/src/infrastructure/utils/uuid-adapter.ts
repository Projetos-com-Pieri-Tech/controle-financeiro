import { v4 as uuidv4 } from 'uuid';

/**
 * Adaptador para transição de ID numérico para UUID
 * Remove quando a migração estiver completa
 */
export class UuidAdapter {
  // Mapeamento temporário para IDs
  private static idToUuidMap = new Map<number, string>();
  private static uuidToIdMap = new Map<string, number>();
  private static nextId = 1;

  /**
   * Gera UUID para novo registro ou retorna existente
   */
  static generateUuid(id?: number): string {
    if (id && this.idToUuidMap.has(id)) {
      return this.idToUuidMap.get(id)!;
    }

    const uuid = uuidv4();
    
    if (id) {
      this.idToUuidMap.set(id, uuid);
      this.uuidToIdMap.set(uuid, id);
    }

    return uuid;
  }

  /**
   * Converte UUID para ID numérico (temporário)
   */
  static uuidToId(uuid: string): number {
    if (this.uuidToIdMap.has(uuid)) {
      return this.uuidToIdMap.get(uuid)!;
    }

    // Gerar ID temporário
    const id = this.nextId++;
    this.uuidToIdMap.set(uuid, id);
    this.idToUuidMap.set(id, uuid);
    
    return id;
  }

  /**
   * Converte ID numérico para UUID
   */
  static idToUuid(id: number): string {
    if (this.idToUuidMap.has(id)) {
      return this.idToUuidMap.get(id)!;
    }

    const uuid = this.generateUuid(id);
    return uuid;
  }

  /**
   * Verifica se é UUID válido
   */
  static isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Inicializar com IDs conhecidos (para dados existentes)
   */
  static initializeMapping(mappings: Array<{id: number, uuid: string}>) {
    mappings.forEach(({id, uuid}) => {
      this.idToUuidMap.set(id, uuid);
      this.uuidToIdMap.set(uuid, id);
      if (id >= this.nextId) {
        this.nextId = id + 1;
      }
    });
  }
}
