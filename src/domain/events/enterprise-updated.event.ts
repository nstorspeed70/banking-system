import { IEvent } from '@nestjs/cqrs';
import { Enterprise } from '../entities/enterprise.entity';
import { EnterpriseAggregate } from '../aggregates/enterprise/enterprise.aggregate';

/**
 * Domain event triggered when an enterprise is updated
 */
export interface EnterpriseUpdatedEventData {
  aggregateId: string;
  taxId: string;
  legalBusinessName: string;
  enterpriseType: string;
  contactEmail: string;
  timestamp: Date;
}

export class EnterpriseUpdatedEvent implements IEvent {
  public readonly eventType: string = 'EnterpriseUpdated';
  public readonly timestamp: Date;

  constructor(public readonly data: EnterpriseUpdatedEventData) {
    this.timestamp = data.timestamp || new Date();
  }

  /**
   * Create event from enterprise aggregate
   */
  static fromAggregate(enterprise: Enterprise | EnterpriseAggregate): EnterpriseUpdatedEvent {
    return new EnterpriseUpdatedEvent({
      aggregateId: enterprise.id,
      taxId: enterprise.taxId.toString(),
      legalBusinessName: enterprise.legalBusinessName,
      enterpriseType: enterprise.enterpriseType,
      contactEmail: enterprise.contactEmail.toString(),
      timestamp: new Date()
    });
  }

  /**
   * Convert event to EventBridge format
   */
  toEventBridge(): any {
    return {
      'detail-type': this.eventType,
      source: 'sistema-bancario.enterprises',
      detail: {
        ...this.data,
        timestamp: this.timestamp.toISOString()
      }
    };
  }
}
