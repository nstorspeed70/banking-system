import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetEnterpriseQuery } from './get-enterprise.query';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { ENTERPRISE_REPOSITORY } from '../../../infrastructure/repositories/repository.module';
import { EnterpriseNotFoundException } from '../../../domain/exceptions';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';

/**
 * Query handler for retrieving an enterprise by ID
 * Implements CQRS pattern for read operations
 */
@Injectable()
@QueryHandler(GetEnterpriseQuery)
export class GetEnterpriseQueryHandler implements IQueryHandler<GetEnterpriseQuery> {
  constructor(
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  /**
   * Execute query to retrieve an enterprise
   * @throws EnterpriseNotFoundException if enterprise is not found
   */
  async execute(query: GetEnterpriseQuery): Promise<EnterpriseAggregate> {
    const enterprise = await this.enterpriseRepository.findById(query.id);
    
    if (!enterprise) {
      throw new EnterpriseNotFoundException(query.id);
    }
    
    return enterprise;
  }
}
