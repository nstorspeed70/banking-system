import { Inject, Injectable } from '@nestjs/common';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { DuplicateTaxIdException } from '../../../domain/exceptions';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';
import { EnterpriseType } from '../../../domain/enums/enterprise-type.enum';

/**
 * Data transfer object for creating an enterprise
 */
export interface CreateEnterpriseDto {
  legalBusinessName: string;
  taxId: string;
  enterpriseType: EnterpriseType;
  contactEmail: string;
  contactPhone: string;
}

/**
 * Use case for creating a new enterprise
 * Implements Clean Architecture use case pattern
 */
@Injectable()
export class CreateEnterpriseUseCase {
  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  /**
   * Execute the use case
   * @param data Enterprise creation data
   * @throws DuplicateTaxIdException if tax ID is already in use
   */
  async execute(data: CreateEnterpriseDto): Promise<EnterpriseAggregate> {
    // Check for duplicate tax ID
    const existingEnterprise = await this.enterpriseRepository.findByTaxId(data.taxId);
    if (existingEnterprise) {
      throw new DuplicateTaxIdException(data.taxId);
    }

    // Create enterprise aggregate
    const enterprise = EnterpriseAggregate.create({
      taxId: data.taxId,
      legalBusinessName: data.legalBusinessName,
      enterpriseType: data.enterpriseType,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
    });

    // Save and return the new enterprise
    return this.enterpriseRepository.save(enterprise);
  }
}
