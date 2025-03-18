import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteEnterpriseCommand } from './delete-enterprise.command';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { EnterpriseNotFoundException } from '../../../domain/exceptions';

/**
 * Manejador del comando de eliminaciu00f3n de empresa
 */
@Injectable()
@CommandHandler(DeleteEnterpriseCommand)
export class DeleteEnterpriseCommandHandler implements ICommandHandler<DeleteEnterpriseCommand> {
  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  /**
   * Ejecuta el comando de eliminaciu00f3n de empresa
   */
  async execute(command: DeleteEnterpriseCommand): Promise<void> {
    // Verificar que la empresa existe
    const enterprise = await this.enterpriseRepository.findById(command.id);
    if (!enterprise) {
      throw new EnterpriseNotFoundException(command.id);
    }
    
    // Realizar borrado lu00f3gico
    await this.enterpriseRepository.softDelete(command.id);
  }
}
