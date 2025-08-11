/**
 * Base interface for common repository operations
 * @template T - The entity type
 * @template TCreateData - The data type for creating entities (usually Omit<T, 'id' | 'createdAt' | 'updatedAt'>)
 * @template TUpdateData - The data type for updating entities (usually Partial<T>)
 */
export interface BaseRepository<T, TCreateData = Omit<T, 'id' | 'createdAt' | 'updatedAt'>, TUpdateData = Partial<T>> {
  /**
   * Find an entity by its ID
   * @param id - The UUID of the entity
   * @returns Promise that resolves to the entity or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities
   * @returns Promise that resolves to an array of all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Create a new entity
   * @param data - The data to create the entity with
   * @returns Promise that resolves to the created entity
   */
  create(data: TCreateData): Promise<T>;

  /**
   * Update an existing entity
   * @param id - The UUID of the entity to update
   * @param data - The partial data to update the entity with
   * @returns Promise that resolves to the updated entity or null if not found
   */
  update(id: string, data: TUpdateData): Promise<T | null>;

  /**
   * Delete an entity (soft delete)
   * @param id - The UUID of the entity to delete
   * @returns Promise that resolves to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;
}
