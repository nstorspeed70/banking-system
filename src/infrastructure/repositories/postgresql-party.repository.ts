import { Pool } from 'pg';
import { IPartyRepository, PartyFilter } from '../../domain/repositories/party.repository.interface';
import { PartyAggregate } from '../../domain/aggregates/party/party.aggregate';
import { PartyRole } from '../../domain/enums/party-role.enum';

export class PostgresqlPartyRepository implements IPartyRepository {
    constructor(private readonly pool: Pool) {}

    async findAll(filter: PartyFilter): Promise<{ parties: PartyAggregate[]; total: number }> {
        const { enterpriseId, role, page = 1, limit = 10 } = filter;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM parties WHERE is_active = true';
        const values: any[] = [];

        if (enterpriseId) {
            values.push(enterpriseId);
            query += ` AND enterprise_id = $${values.length}`;
        }

        if (role) {
            values.push(role);
            query += ` AND role = $${values.length}`;
        }

        // Get total
        const countResult = await this.pool.query(
            `SELECT COUNT(*) FROM (${query}) AS count`,
            values
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated results
        query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);

        const result = await this.pool.query(query, values);

        const parties = result.rows.map(row => this.mapToAggregate(row));
        return { parties, total };
    }

    async findById(id: string): Promise<PartyAggregate | null> {
        const result = await this.pool.query(
            'SELECT * FROM parties WHERE id = $1 AND is_active = true',
            [id]
        );

        return result.rows.length > 0 ? this.mapToAggregate(result.rows[0]) : null;
    }

    async findByEmail(email: string): Promise<PartyAggregate | null> {
        const result = await this.pool.query(
            'SELECT * FROM parties WHERE email = $1 AND is_active = true',
            [email]
        );

        return result.rows.length > 0 ? this.mapToAggregate(result.rows[0]) : null;
    }

    async findByEnterpriseId(enterpriseId: string): Promise<PartyAggregate[]> {
        const result = await this.pool.query(
            'SELECT * FROM parties WHERE enterprise_id = $1 AND is_active = true',
            [enterpriseId]
        );

        return result.rows.map(row => this.mapToAggregate(row));
    }

    async findEnterprisesForParty(partyId: string): Promise<string[]> {
        const result = await this.pool.query(
            'SELECT enterprise_id FROM parties WHERE id = $1 AND is_active = true',
            [partyId]
        );

        return result.rows.map(row => row.enterprise_id);
    }

    async create(party: PartyAggregate): Promise<PartyAggregate> {
        const result = await this.pool.query(
            `INSERT INTO parties (
                id, name, email, role, enterprise_id, is_active, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                party.id,
                party.name,
                party.email.value,
                party.role,
                party.enterpriseId,
                party.isActive,
                party.createdAt,
                party.updatedAt
            ]
        );

        return this.mapToAggregate(result.rows[0]);
    }

    async update(id: string, party: Partial<PartyAggregate>): Promise<PartyAggregate | null> {
        const updateFields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (party.name) {
            updateFields.push(`name = $${paramCount++}`);
            values.push(party.name);
        }

        if (party.email) {
            updateFields.push(`email = $${paramCount++}`);
            values.push(party.email.value);
        }

        if (party.role) {
            updateFields.push(`role = $${paramCount++}`);
            values.push(party.role);
        }

        updateFields.push(`updated_at = $${paramCount++}`);
        values.push(new Date());

        values.push(id);

        const result = await this.pool.query(
            `UPDATE parties SET ${updateFields.join(', ')} 
            WHERE id = $${paramCount} AND is_active = true RETURNING *`,
            values
        );

        return result.rows.length > 0 ? this.mapToAggregate(result.rows[0]) : null;
    }

    async softDelete(id: string): Promise<void> {
        await this.pool.query(
            'UPDATE parties SET is_active = false, updated_at = $1 WHERE id = $2',
            [new Date(), id]
        );
    }

    async enterpriseExists(enterpriseId: string): Promise<boolean> {
        const result = await this.pool.query(
            'SELECT 1 FROM enterprises WHERE id = $1 AND is_active = true',
            [enterpriseId]
        );
        return result.rows.length > 0;
    }

    private mapToAggregate(row: any): PartyAggregate {
        return PartyAggregate.reconstitute(
            row.id,
            row.name,
            row.email,
            row.role as PartyRole,
            row.enterprise_id,
            row.is_active,
            row.created_at,
            row.updated_at
        );
    }
}
