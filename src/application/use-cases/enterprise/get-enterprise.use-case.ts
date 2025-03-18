import { Inject, Injectable } from '@nestjs/common';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { EnterpriseNotFoundException } from '../../../domain/exceptions';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';

/**
 * Caso de uso para obtener una empresa por su ID
 */
@Injectable()
export class GetEnterpriseUseCase {
  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository
  ) {}

  /**
   * Obtiene una empresa por su ID
   * @param id Identificador de la empresa (puede ser numérico o string)
   * @returns La empresa encontrada
   * @throws EnterpriseNotFoundException si la empresa no existe
   */
  async execute(id: string | number): Promise<EnterpriseAggregate> {
    // Convertir el ID a string si es numérico
    const enterpriseId = id.toString();
    
    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    
    if (!enterprise) {
      throw new EnterpriseNotFoundException(enterpriseId);
    }
    
    return enterprise;
  }
}
