import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnterpriseEntity } from '../entities/enterprise.entity';
import { PartyEntity } from '../entities/party.entity';
import { CreateInitialSchema1710731020000 } from '../migrations/1710731020000-CreateInitialSchema';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'sistema_bancario',
  entities: [EnterpriseEntity, PartyEntity],
  migrations: [CreateInitialSchema1710731020000],
  migrationsRun: process.env.NODE_ENV === 'production',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
