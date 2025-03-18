import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoryModule } from '../infrastructure/repositories/repository.module';

// Commands
import { CreateEnterpriseCommandHandler } from '../application/commands/enterprise/create-enterprise.handler';
import { UpdateEnterpriseCommandHandler } from '../application/commands/enterprise/update-enterprise.handler';
import { DeleteEnterpriseCommandHandler } from '../application/commands/enterprise/delete-enterprise.handler';

// Queries
import { GetEnterpriseQueryHandler } from '../application/queries/enterprise/get-enterprise.handler';
import { ListEnterprisesUseCase } from '../application/use-cases/enterprise/list-enterprises.use-case';

// Use Cases
import { CreateEnterpriseUseCase } from '../application/use-cases/enterprise/create-enterprise.use-case';
import { UpdateEnterpriseUseCase } from '../application/use-cases/enterprise/update-enterprise.use-case';
import { DeleteEnterpriseUseCase } from '../application/use-cases/enterprise/delete-enterprise.use-case';

/**
 * Enterprise Module
 * Implements Clean Architecture and DDD principles for enterprise domain
 */
@Module({
  imports: [
    CqrsModule,
    RepositoryModule
  ],
  providers: [
    // Command Handlers
    CreateEnterpriseCommandHandler,
    UpdateEnterpriseCommandHandler,
    DeleteEnterpriseCommandHandler,

    // Query Handlers
    GetEnterpriseQueryHandler,
    ListEnterprisesUseCase,

    // Use Cases
    CreateEnterpriseUseCase,
    UpdateEnterpriseUseCase,
    DeleteEnterpriseUseCase,
  ],
  exports: [
    CreateEnterpriseUseCase,
    UpdateEnterpriseUseCase,
    DeleteEnterpriseUseCase,
    ListEnterprisesUseCase,
    GetEnterpriseQueryHandler,
  ]
})
export class EnterpriseModule {}
