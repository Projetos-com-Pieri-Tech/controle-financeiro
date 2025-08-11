import { RoleRepository } from '../../../domain/ports/RoleRepository';
import { Role } from '../../../domain/entities/role';
import mysql, { Pool } from 'mysql2/promise';
import { createDatabasePool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export class MySQLRoleRepositoryUUID implements RoleRepository {
  private db: Pool;

  constructor() {
    this.db = createDatabasePool();
  }

  async create(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    const id = uuidv4();
    const now = new Date();
    
    await this.db.execute(
      `INSERT INTO roles (id, name, description, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        id, 
        role.name, 
        role.description || null,
        now,
        now
      ]
    );

    return this.findById(id) as Promise<Role>;
  }

  async findById(id: string): Promise<Role | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM roles WHERE id = ?',
      [id]
    );

    const roles = rows as Role[];
    if (roles.length === 0) {
      return null;
    }

    return this.mapRowToRole(roles[0]);
  }

  async findAll(): Promise<Role[]> {
    const [rows] = await this.db.execute(
      'SELECT * FROM roles ORDER BY name'
    );

    const roles = rows as Role[];
    return roles.map(this.mapRowToRole);
  }

  async findByName(name: string): Promise<Role | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM roles WHERE name = ?',
      [name]
    );

    const roles = rows as Role[];
    if (roles.length === 0) {
      return null;
    }

    return this.mapRowToRole(roles[0]);
  }

  async update(id: string, role: Partial<Role>): Promise<Role | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (role.name !== undefined) {
      updates.push('name = ?');
      values.push(role.name);
    }
    if (role.description !== undefined) {
      updates.push('description = ?');
      values.push(role.description);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = ?');
    values.push(new Date());
    values.push(id);

    await this.db.execute(
      `UPDATE roles SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Verificar se o role está sendo usado por usuários
      const [userRows] = await this.db.execute(
        'SELECT COUNT(*) as count FROM users WHERE role_id = ?',
        [id]
      );

      const userCount = (userRows as any[])[0].count;
      if (userCount > 0) {
        throw new Error('Cannot delete role that is being used by users');
      }

      const [result] = await this.db.execute(
        'DELETE FROM roles WHERE id = ?',
        [id]
      );

      const deleteResult = result as any;
      return deleteResult.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting role:', error);
      return false;
    }
  }

  private mapRowToRole(row: any): Role {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    };
  }
}
