import { Inject, Injectable } from '@nestjs/common';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { EnterpriseNotFoundException } from '../../../domain/exceptions';

/**
 * Caso de uso para eliminar una empresa (borrado lógico)
 */
@Injectable()
export class DeleteEnterpriseUseCase {
  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository
  ) {}

  /**
   * Elimina una empresa (borrado lógico)
   * @param id ID de la empresa a eliminar
   * @throws EnterpriseNotFoundException si la empresa no existe
   */
  async execute(id: string | number): Promise<void> {
    const enterpriseId = id.toString();
    const enterprise = await this.enterpriseRepository.findById(enterpriseId);

    if (!enterprise) {
      throw new EnterpriseNotFoundException(enterpriseId);
    }

    await this.enterpriseRepository.softDelete(enterpriseId);
  }
}
