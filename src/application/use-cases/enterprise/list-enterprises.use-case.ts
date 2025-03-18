import { Inject, Injectable } from '@nestjs/common';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';
import { EnterpriseType } from '../../../domain/enums/enterprise-type.enum';

/**
 * Use case for listing enterprises with filtering and pagination
 */
export interface ListEnterprisesFilter {
  enterpriseType?: EnterpriseType;
  page?: number;
  limit?: number;
}

export interface ListEnterprisesResult {
  items: EnterpriseAggregate[];
  total: number;
}

@Injectable()
export class ListEnterprisesUseCase {
  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  /**
   * Execute the use case
   * @param filter Optional filtering and pagination parameters
   */
  async execute(filter?: ListEnterprisesFilter): Promise<ListEnterprisesResult> {
    return this.enterpriseRepository.findAll({
      enterpriseType: filter?.enterpriseType,
      page: filter?.page,
      limit: filter?.limit,
    });
  }
}
