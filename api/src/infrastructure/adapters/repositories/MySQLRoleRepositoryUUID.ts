import { RoleRepository } from '../../../domain/ports/RoleRepository';
import { Role } from '../../../domain/entities/role';
import { RowDataPacket } from 'mysql2/promise';
import { MySQLBaseRepository } from './MySQLBaseRepository';

export class MySQLRoleRepositoryUUID extends MySQLBaseRepository<Role> implements RoleRepository {

  async create(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    const id = this.generateId();
    const query = `
      INSERT INTO roles (id, name, description, created_at, updated_at) 
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    
    await this.executeInsert(query, [
      id, 
      role.name, 
      role.description || null
    ]);

    return this.findById(id) as Promise<Role>;
  }

  async findById(id: string): Promise<Role | null> {
    return this.findByIdBase('roles', id, this.mapRowToEntity.bind(this));
  }

  async findAll(): Promise<Role[]> {
    const query = `SELECT * FROM roles ORDER BY name`;
    const rows = await this.executeSelect<RowDataPacket>(query);
    return rows.map(row => this.mapRowToEntity(row));
  }

  async findByName(name: string): Promise<Role | null> {
    const query = `SELECT * FROM roles WHERE name = ?`;
    const rows = await this.executeSelect<RowDataPacket>(query, [name]);
    return rows.length > 0 ? this.mapRowToEntity(rows[0]) : null;
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

    updates.push('updated_at = NOW()');
    values.push(id);

    const query = `UPDATE roles SET ${updates.join(', ')} WHERE id = ?`;
    const success = await this.executeUpdate(query, values);
    
    return success ? this.findById(id) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Verificar se o role está sendo usado por usuários
      const userRows = await this.executeSelect<RowDataPacket>(
        'SELECT COUNT(*) as count FROM users WHERE role_id = ?',
        [id]
      );

      const userCount = userRows[0].count;
      if (userCount > 0) {
        throw new Error('Cannot delete role that is being used by users');
      }

      const query = 'DELETE FROM roles WHERE id = ?';
      const [result] = await this.pool.execute(query, [id]);
      const deleteResult = result as any;
      return deleteResult.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting role:', error);
      return false;
    }
  }

  protected mapRowToEntity(row: RowDataPacket): Role {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null
    };
  }
}
