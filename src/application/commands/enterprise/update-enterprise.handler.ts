import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateEnterpriseCommand } from './update-enterprise.command';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { EnterpriseNotFoundException, DuplicateTaxIdException } from '../../../domain/exceptions';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';
import { TaxId } from '../../../domain/value-objects/tax-id.value-object';
import { Email } from '../../../domain/value-objects/email.value-object';

/**
 * Manejador del comando de actualizaciu00f3n de empresa
 */
@Injectable()
@CommandHandler(UpdateEnterpriseCommand)
export class UpdateEnterpriseCommandHandler implements ICommandHandler<UpdateEnterpriseCommand> {
  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  /**
   * Ejecuta el comando de actualizaciu00f3n de empresa
   */
  async execute(command: UpdateEnterpriseCommand): Promise<EnterpriseAggregate> {
    // Buscar la empresa a actualizar
    const existingEnterprise = await this.enterpriseRepository.findById(command.id);
    if (!existingEnterprise) {
      throw new EnterpriseNotFoundException(command.id);
    }

    // Validar taxId si se proporciona
    if (command.taxId && command.taxId !== existingEnterprise.taxId.toString()) {
      const enterpriseWithTaxId = await this.enterpriseRepository.findByTaxId(command.taxId);
      if (enterpriseWithTaxId && enterpriseWithTaxId.id !== command.id) {
        throw new DuplicateTaxIdException(command.taxId);
      }
    }

    // Crear agregado actualizado
    const updatedEnterprise = EnterpriseAggregate.create({
      taxId: command.taxId || existingEnterprise.taxId.toString(),
      legalBusinessName: command.legalBusinessName || existingEnterprise.legalBusinessName,
      enterpriseType: command.enterpriseType || existingEnterprise.enterpriseType,
      contactEmail: command.contactEmail || existingEnterprise.contactEmail.toString(),
      contactPhone: command.contactPhone || existingEnterprise.contactPhone,
    });

    // Guardar y devolver agregado actualizado
    return this.enterpriseRepository.save(updatedEnterprise);
  }
}
