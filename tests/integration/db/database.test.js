require('dotenv').config({ path: '.env.test' });
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20
});

describe('Database Integration Tests', () => {
    let client;
    let testEnterpriseId;

    beforeAll(async () => {
        try {
            // Verificar conexión a la base de datos
            const isConnected = await checkDatabaseConnection(pool);
            if (!isConnected) {
                throw new Error('Could not connect to database');
            }

            client = await pool.connect();
            console.log('Connected to database successfully');
            
            // Limpiar datos de prueba anteriores
            await cleanDatabase(pool);
        } catch (error) {
            console.error('Error in test setup:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            if (client) {
                await client.release();
            }
            await pool.end();
        } catch (error) {
            console.error('Error in test cleanup:', error);
        }
    });

    describe('Enterprises Table', () => {
        it('should create enterprise record', async () => {
            const taxId = "20" + Math.floor(Math.random() * 999999999);
            const result = await client.query(
                `INSERT INTO enterprises (
                    tax_id,
                    legal_business_name,
                    enterprise_type,
                    contact_email,
                    contact_phone,
                    is_active
                ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    taxId,
                    "Test Enterprise",
                    "SAC",
                    `test.${uuidv4()}@example.com`,
                    "+51999888777",
                    true
                ]
            );

            expect(result.rows[0]).toHaveProperty('id');
            expect(result.rows[0].tax_id).toBe(taxId);
            testEnterpriseId = result.rows[0].id;
        });

        it('should enforce unique tax_id constraint', async () => {
            const taxId = "20999888777";
            
            // Primera inserción
            await client.query(
                `INSERT INTO enterprises (
                    tax_id,
                    legal_business_name,
                    enterprise_type,
                    contact_email,
                    contact_phone,
                    is_active
                ) VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    taxId,
                    "Test Enterprise 1",
                    "SAC",
                    `test1.${uuidv4()}@example.com`,
                    "+51999888777",
                    true
                ]
            );

            // Segunda inserción con el mismo tax_id
            try {
                await client.query(
                    `INSERT INTO enterprises (
                        tax_id,
                        legal_business_name,
                        enterprise_type,
                        contact_email,
                        contact_phone,
                        is_active
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        taxId,
                        "Test Enterprise 2",
                        "SAC",
                        `test2.${uuidv4()}@example.com`,
                        "+51999888777",
                        true
                    ]
                );
                fail('Should have thrown unique constraint error');
            } catch (error) {
                expect(error.code).toBe('23505'); // Código de error de PostgreSQL para violación de restricción única
            }
        });

        it('should update enterprise record', async () => {
            const newName = "Updated Test Enterprise";
            const result = await client.query(
                `UPDATE enterprises
                SET legal_business_name = $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *`,
                [newName, testEnterpriseId]
            );

            expect(result.rows[0].legal_business_name).toBe(newName);
            expect(result.rows[0].updated_at).not.toBe(result.rows[0].created_at);
        });

        it('should soft delete enterprise record', async () => {
            await client.query(
                `UPDATE enterprises
                SET is_active = false,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1`,
                [testEnterpriseId]
            );

            const result = await client.query(
                'SELECT * FROM enterprises WHERE id = $1',
                [testEnterpriseId]
            );

            expect(result.rows[0].is_active).toBe(false);
        });
    });

    describe('Parties Table', () => {
        let testPartyId;

        it('should create party record', async () => {
            const result = await client.query(
                `INSERT INTO parties (
                    name,
                    email,
                    role,
                    is_active
                ) VALUES ($1, $2, $3, $4) RETURNING *`,
                [
                    "Test Party",
                    `test.${uuidv4()}@example.com`,
                    "EMPLOYEE",
                    true
                ]
            );

            expect(result.rows[0]).toHaveProperty('id');
            expect(result.rows[0].role).toBe("EMPLOYEE");
            testPartyId = result.rows[0].id;
        });

        it('should create enterprise-party relationship', async () => {
            const result = await client.query(
                `INSERT INTO enterprise_parties (
                    enterprise_id,
                    party_id
                ) VALUES ($1, $2) RETURNING *`,
                [testEnterpriseId, testPartyId]
            );

            expect(result.rows[0].enterprise_id).toBe(testEnterpriseId);
            expect(result.rows[0].party_id).toBe(testPartyId);
        });

        it('should list parties for enterprise', async () => {
            const result = await client.query(
                `SELECT p.*
                FROM parties p
                JOIN enterprise_parties ep ON p.id = ep.party_id
                WHERE ep.enterprise_id = $1
                AND p.is_active = true`,
                [testEnterpriseId]
            );

            expect(result.rows.length).toBeGreaterThan(0);
            expect(result.rows[0].id).toBe(testPartyId);
        });

        it('should update party role', async () => {
            const newRole = "ADMIN";
            const result = await client.query(
                `UPDATE parties
                SET role = $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *`,
                [newRole, testPartyId]
            );

            expect(result.rows[0].role).toBe(newRole);
        });
    });

    describe('Database Constraints', () => {
        it('should enforce email format', async () => {
            try {
                await client.query(
                    `INSERT INTO parties (
                        name,
                        email,
                        role,
                        is_active
                    ) VALUES ($1, $2, $3, $4)`,
                    [
                        "Invalid Email Test",
                        "not-an-email",
                        "EMPLOYEE",
                        true
                    ]
                );
                fail('Should have thrown check constraint error');
            } catch (error) {
                expect(error.code).toBe('23514'); // Código de error de PostgreSQL para violación de restricción de verificación
            }
        });

        it('should enforce role values', async () => {
            try {
                await client.query(
                    `INSERT INTO parties (
                        name,
                        email,
                        role,
                        is_active
                    ) VALUES ($1, $2, $3, $4)`,
                    [
                        "Invalid Role Test",
                        `test.${uuidv4()}@example.com`,
                        "INVALID_ROLE",
                        true
                    ]
                );
                fail('Should have thrown check constraint error');
            } catch (error) {
                expect(error.code).toBe('23514');
            }
        });
    });
});

// Función para limpiar datos de prueba anteriores
async function cleanDatabase(pool) {
    try {
        await pool.query('DELETE FROM enterprise_parties');
        await pool.query('DELETE FROM parties');
        await pool.query('DELETE FROM enterprises');
    } catch (error) {
        console.error('Error cleaning database:', error);
    }
}

// Función para verificar la conexión a la base de datos
async function checkDatabaseConnection(pool) {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch (error) {
        console.error('Error checking database connection:', error);
        return false;
    }
}
