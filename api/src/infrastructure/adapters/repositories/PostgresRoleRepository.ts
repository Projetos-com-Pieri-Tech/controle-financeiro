import { Pool } from 'pg';
import { Role } from '../../../domain/entities/role';
import { RoleRepository } from '../../../domain/ports/RoleRepository';

export class PostgresRoleRepository implements RoleRepository {
  constructor(private pool: Pool) {}

  async findById(id: number): Promise<Role | null> {
    const query = `
      SELECT id, name, description, created_at, updated_at, deleted_at
      FROM roles
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findByName(name: string): Promise<Role | null> {
    const query = `
      SELECT id, name, description, created_at, updated_at, deleted_at
      FROM roles
      WHERE name = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [name]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async create(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    const query = `
      INSERT INTO roles (name, description, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id, name, description, created_at, updated_at, deleted_at
    `;

    const values = [role.name, role.description];
    const result = await this.pool.query(query, values);

    return this.mapToEntity(result.rows[0]);
  }

  async update(id: number, role: Partial<Role>): Promise<Role | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (role.name !== undefined) {
      fields.push(`name = ${paramCount++}`);
      values.push(role.name);
    }
    if (role.description !== undefined) {
      fields.push(`description = ${paramCount++}`);
      values.push(role.description);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE roles
      SET ${fields.join(', ')}
      WHERE id = ${paramCount} AND deleted_at IS NULL
      RETURNING id, name, description, created_at, updated_at, deleted_at
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE roles
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(): Promise<Role[]> {
    const query = `
      SELECT id, name, description, created_at, updated_at, deleted_at
      FROM roles
      WHERE deleted_at IS NULL
      ORDER BY name
    `;

    const result = await this.pool.query(query);
    return result.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Role {
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