import { Module, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoryModule } from '../../infrastructure/repositories/repository.module';
import { EventsModule } from '../../infrastructure/events/events.module';

// Commands
import { CreateEnterpriseCommandHandler } from '../../application/commands/enterprise/create-enterprise.handler';
import { UpdateEnterpriseCommandHandler } from '../../application/commands/enterprise/update-enterprise.handler';
import { DeleteEnterpriseCommandHandler } from '../../application/commands/enterprise/delete-enterprise.handler';

// Queries
import { GetEnterpriseQueryHandler } from '../../application/queries/enterprise/get-enterprise.handler';
import { ListEnterprisesUseCase } from '../../application/use-cases/enterprise/list-enterprises.use-case';

// Use Cases
import { CreateEnterpriseUseCase } from '../../application/use-cases/enterprise/create-enterprise.use-case';
import { UpdateEnterpriseUseCase } from '../../application/use-cases/enterprise/update-enterprise.use-case';
import { DeleteEnterpriseUseCase } from '../../application/use-cases/enterprise/delete-enterprise.use-case';

// Event Handlers
import { EnterpriseEventHandler } from './handlers/enterprise-event.handler';

// Controllers
import { EnterpriseController } from '../../interface/api/controllers/enterprise.controller';

/**
 * Enterprise Module
 * Handles enterprise domain logic, events, and use cases
 */
@Module({
  imports: [
    CqrsModule,
    RepositoryModule,
    EventsModule
  ],
  controllers: [
    EnterpriseController,
  ],
  providers: [
    // Command Handlers
    CreateEnterpriseCommandHandler,
    UpdateEnterpriseCommandHandler,
    DeleteEnterpriseCommandHandler,
    
    // Query Handlers
    GetEnterpriseQueryHandler,
    
    // Event Handlers
    EnterpriseEventHandler,

    // Use Cases
    CreateEnterpriseUseCase,
    UpdateEnterpriseUseCase,
    DeleteEnterpriseUseCase,
    ListEnterprisesUseCase,
  ],
  exports: [
    CreateEnterpriseUseCase,
    UpdateEnterpriseUseCase,
    DeleteEnterpriseUseCase,
    ListEnterprisesUseCase,
    GetEnterpriseQueryHandler,
  ]
})
export class EnterpriseModule {
  constructor() {
    const logger = new Logger(EnterpriseModule.name);
    logger.log('Módulo de empresa inicializado');
  }
}
