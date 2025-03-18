import { Module } from '@nestjs/common';
import { EnterpriseController } from './enterprise.controller';
import { CreateEnterpriseUseCase } from '../../../../application/use-cases/enterprise/create-enterprise.use-case';
import { DeleteEnterpriseUseCase } from '../../../../application/use-cases/enterprise/delete-enterprise.use-case';
import { GetEnterpriseUseCase } from '../../../../application/use-cases/enterprise/get-enterprise.use-case';
import { ListEnterprisesUseCase } from '../../../../application/use-cases/enterprise/list-enterprises.use-case';
import { UpdateEnterpriseUseCase } from '../../../../application/use-cases/enterprise/update-enterprise.use-case';
import { RepositoryModule } from '../../../../infrastructure/repositories/repository.module';

/**
 * Módulo para la gestión de empresas
 */
@Module({
  controllers: [EnterpriseController],
  providers: [
    CreateEnterpriseUseCase,
    DeleteEnterpriseUseCase,
    GetEnterpriseUseCase,
    ListEnterprisesUseCase,
    UpdateEnterpriseUseCase,
  ],
  imports: [RepositoryModule],
})
export class EnterpriseModule {}
