import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1710731020000 implements MigrationInterface {
    name = 'CreateInitialSchema1710731020000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear enum para tipo de empresa
        await queryRunner.query(`
            CREATE TYPE enterprise_type AS ENUM ('SAC', 'SRL', 'SA')
        `);

        // Crear tabla de empresas
        await queryRunner.query(`
            CREATE TABLE enterprises (
                id SERIAL PRIMARY KEY,
                legal_business_name VARCHAR(100) NOT NULL,
                tax_id VARCHAR(15) UNIQUE NOT NULL,
                enterprise_type enterprise_type NOT NULL,
                contact_email VARCHAR(100) NOT NULL,
                contact_phone VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de personas
        await queryRunner.query(`
            CREATE TABLE parties (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                role VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de relación empresa-persona
        await queryRunner.query(`
            CREATE TABLE enterprise_parties (
                enterprise_id INTEGER REFERENCES enterprises(id),
                party_id INTEGER REFERENCES parties(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (enterprise_id, party_id)
            )
        `);

        // Crear índices
        await queryRunner.query(`
            CREATE INDEX idx_enterprises_tax_id ON enterprises(tax_id);
            CREATE INDEX idx_enterprises_is_active ON enterprises(is_active);
            CREATE INDEX idx_parties_email ON parties(email);
            CREATE INDEX idx_parties_is_active ON parties(is_active);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar índices
        await queryRunner.query(`
            DROP INDEX IF EXISTS idx_parties_is_active;
            DROP INDEX IF EXISTS idx_parties_email;
            DROP INDEX IF EXISTS idx_enterprises_is_active;
            DROP INDEX IF EXISTS idx_enterprises_tax_id;
        `);

        // Eliminar tablas
        await queryRunner.query(`DROP TABLE IF EXISTS enterprise_parties`);
        await queryRunner.query(`DROP TABLE IF EXISTS parties`);
        await queryRunner.query(`DROP TABLE IF EXISTS enterprises`);

        // Eliminar enum
        await queryRunner.query(`DROP TYPE IF EXISTS enterprise_type`);
    }
}
