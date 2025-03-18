import { Injectable } from '@nestjs/common';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';

/**
 * In-Memory Enterprise Repository Implementation
 * Used for testing and development
 */
@Injectable()
export class InMemoryEnterpriseRepository implements IEnterpriseRepository {
  private enterprises: Map<string, EnterpriseAggregate> = new Map();

  /**
   * Save an enterprise aggregate
   */
  async save(enterprise: EnterpriseAggregate): Promise<EnterpriseAggregate> {
    this.enterprises.set(enterprise.id, enterprise);
    return enterprise;
  }

  /**
   * Find enterprise by ID
   */
  async findById(id: string): Promise<EnterpriseAggregate | null> {
    return this.enterprises.get(id) || null;
  }

  /**
   * Find enterprise by tax ID
   */
  async findByTaxId(taxId: string): Promise<EnterpriseAggregate | null> {
    for (const enterprise of this.enterprises.values()) {
      if (enterprise.taxId.toString() === taxId) {
        return enterprise;
      }
    }
    return null;
  }

  /**
   * Find all enterprises with optional filtering and pagination
   */
  async findAll(filter?: {
    enterpriseType?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: EnterpriseAggregate[];
    total: number;
  }> {
    let enterprises = Array.from(this.enterprises.values());

    // Apply filters
    if (filter?.enterpriseType) {
      enterprises = enterprises.filter(e => e.enterpriseType === filter.enterpriseType);
    }

    // Calculate pagination
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return {
      items: enterprises.slice(startIndex, endIndex),
      total: enterprises.length
    };
  }

  /**
   * Update an enterprise
   */
  async update(id: string, data: Partial<EnterpriseAggregate>): Promise<EnterpriseAggregate> {
    const enterprise = await this.findById(id);
    if (!enterprise) {
      throw new Error(`Enterprise with id ${id} not found`);
    }

    // Create new aggregate with updated data
    const updatedEnterprise = EnterpriseAggregate.create({
      taxId: data.taxId?.toString() || enterprise.taxId.toString(),
      legalBusinessName: data.legalBusinessName || enterprise.legalBusinessName,
      enterpriseType: data.enterpriseType || enterprise.enterpriseType,
      contactEmail: data.contactEmail?.toString() || enterprise.contactEmail.toString(),
      contactPhone: data.contactPhone || enterprise.contactPhone,
    });

    // Save and return updated aggregate
    return this.save(updatedEnterprise);
  }

  /**
   * Soft delete an enterprise
   */
  async softDelete(id: string): Promise<void> {
    const enterprise = await this.findById(id);
    if (!enterprise) {
      throw new Error(`Enterprise with id ${id} not found`);
    }

    // In a real implementation, we would set isActive to false
    // For in-memory, we'll just remove it from the map
    this.enterprises.delete(id);
  }
}
