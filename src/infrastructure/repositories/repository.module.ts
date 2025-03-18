import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnterpriseEntity } from '../entities/enterprise.entity';
import { PartyEntity } from '../entities/party.entity';
import { PostgresqlEnterpriseRepository } from './postgresql/postgresql-enterprise.repository';

export const ENTERPRISE_REPOSITORY = 'ENTERPRISE_REPOSITORY';

/**
 * Módulo que proporciona las implementaciones de los repositorios
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([EnterpriseEntity, PartyEntity]),
  ],
  providers: [
    {
      provide: ENTERPRISE_REPOSITORY,
      useClass: PostgresqlEnterpriseRepository,
    },
  ],
  exports: [ENTERPRISE_REPOSITORY],
})
export class RepositoryModule {}
