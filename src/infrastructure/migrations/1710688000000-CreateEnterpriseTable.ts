import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { EnterpriseType } from '../../domain/enums/enterprise-type.enum';

export class CreateEnterpriseTable1710688000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear el tipo enum para enterprise_type
    await queryRunner.query(`
      CREATE TYPE enterprise_type_enum AS ENUM (
        'SAC', 'SA', 'SRL', 'EIRL'
      )
    `);

    // Crear la tabla enterprises
    await queryRunner.createTable(
      new Table({
        name: 'enterprises',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'legal_business_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'tax_id',
            type: 'varchar',
            length: '15',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'enterprise_type',
            type: 'enterprise_type_enum',
            isNullable: false,
          },
          {
            name: 'contact_email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'contact_phone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Crear índices
    await queryRunner.query(`
      CREATE INDEX idx_enterprises_tax_id ON enterprises(tax_id);
      CREATE INDEX idx_enterprises_enterprise_type ON enterprises(enterprise_type);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_enterprises_tax_id;
      DROP INDEX IF EXISTS idx_enterprises_enterprise_type;
    `);

    // Eliminar tabla
    await queryRunner.dropTable('enterprises');

    // Eliminar tipo enum
    await queryRunner.query('DROP TYPE IF EXISTS enterprise_type_enum');
  }
}
