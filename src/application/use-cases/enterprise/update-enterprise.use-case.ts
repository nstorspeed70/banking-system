import { Inject, Injectable } from '@nestjs/common';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { EnterpriseNotFoundException } from '../../../domain/exceptions';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';
import { UpdateEnterpriseDto } from '../../../interface/api/dtos/enterprise/update-enterprise.dto';

/**
 * Caso de uso para actualizar una empresa existente
 */
@Injectable()
export class UpdateEnterpriseUseCase {
  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository
  ) {}

  /**
   * Actualiza una empresa existente
   * @param id ID de la empresa a actualizar
   * @param data Datos para actualizar
   * @returns La empresa actualizada
   * @throws EnterpriseNotFoundException si la empresa no existe
   */
  async execute(id: string | number, data: UpdateEnterpriseDto): Promise<EnterpriseAggregate> {
    const enterpriseId = id.toString();
    const enterprise = await this.enterpriseRepository.findById(enterpriseId);

    if (!enterprise) {
      throw new EnterpriseNotFoundException(enterpriseId);
    }

    // Actualizar los campos de la empresa
    Object.assign(enterprise, data);

    // Guardar los cambios
    return this.enterpriseRepository.update(enterpriseId, enterprise);
  }
}
