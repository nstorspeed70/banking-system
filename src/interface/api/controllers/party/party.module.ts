import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { AddPartyUseCase } from '../../../../application/use-cases/party/add-party.use-case';
import { UpdatePartyUseCase } from '../../../../application/use-cases/party/update-party.use-case';
import { RepositoryModule } from '../../../../infrastructure/repositories/repository.module';

/**
 * Módulo para la gestión de miembros de empresas
 */
@Module({
  controllers: [PartyController],
  providers: [
    AddPartyUseCase,
    UpdatePartyUseCase,
  ],
  imports: [RepositoryModule],
})
export class PartyModule {}
