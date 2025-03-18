import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateEnterpriseCommand } from './create-enterprise.command';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { DuplicateTaxIdException } from '../../../domain/exceptions';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';

/**
 * Command handler for creating a new enterprise
 * Implements CQRS pattern and follows DDD principles
 */
@Injectable()
@CommandHandler(CreateEnterpriseCommand)
export class CreateEnterpriseCommandHandler implements ICommandHandler<CreateEnterpriseCommand> {
  private readonly logger = new Logger(CreateEnterpriseCommandHandler.name);

  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository
  ) {
    this.logger.log(' Inicializado manejador de comandos de creación de empresa');
  }

  async execute(command: CreateEnterpriseCommand): Promise<EnterpriseAggregate> {
    this.logger.log(' Ejecutando comando de creación de empresa...');
    this.logger.debug('Datos del comando:', command);

    // Check for duplicate tax ID
    this.logger.log(' Verificando duplicidad de RUC/NIT...');
    const existingEnterprise = await this.enterpriseRepository.findByTaxId(command.taxId);
    if (existingEnterprise) {
      this.logger.error(` RUC/NIT duplicado: ${command.taxId}`);
      throw new DuplicateTaxIdException(command.taxId);
    }

    // Create enterprise aggregate
    this.logger.log(' Creando agregado de empresa...');
    const enterprise = EnterpriseAggregate.create({
      taxId: command.taxId,
      legalBusinessName: command.legalBusinessName,
      enterpriseType: command.enterpriseType,
      contactEmail: command.contactEmail,
      contactPhone: command.contactPhone,
    });

    this.logger.debug('Agregado creado:', enterprise);

    // Save the enterprise
    this.logger.log(' Guardando empresa en el repositorio...');
    const savedEnterprise = await this.enterpriseRepository.save(enterprise);
    this.logger.debug('Empresa guardada:', savedEnterprise);

    this.logger.log(' Empresa creada exitosamente');
    return savedEnterprise;
  }
}
