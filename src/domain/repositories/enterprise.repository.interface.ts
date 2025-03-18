import { EnterpriseAggregate } from '../aggregates/enterprise/enterprise.aggregate';

/**
 * Enterprise Repository Interface
 * Follows Repository Pattern from DDD
 */
export interface IEnterpriseRepository {
  /**
   * Save an enterprise aggregate
   * @param enterprise Enterprise aggregate to save
   */
  save(enterprise: EnterpriseAggregate): Promise<EnterpriseAggregate>;

  /**
   * Find enterprise by ID
   * @param id Enterprise ID
   */
  findById(id: string): Promise<EnterpriseAggregate | null>;

  /**
   * Find enterprise by tax ID
   * @param taxId Tax ID to search for
   */
  findByTaxId(taxId: string): Promise<EnterpriseAggregate | null>;

  /**
   * Find all enterprises with optional filtering and pagination
   * @param filter Filter and pagination options
   */
  findAll(filter?: {
    enterpriseType?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: EnterpriseAggregate[];
    total: number;
  }>;

  /**
   * Update an enterprise
   * @param id Enterprise ID
   * @param data Partial enterprise data to update
   */
  update(id: string, data: Partial<EnterpriseAggregate>): Promise<EnterpriseAggregate>;

  /**
   * Soft delete an enterprise
   * @param id Enterprise ID
   */
  softDelete(id: string): Promise<void>;
}
