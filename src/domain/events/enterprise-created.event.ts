import { IEvent } from '@nestjs/cqrs';
import { Enterprise } from '../entities/enterprise.entity';
import { EnterpriseAggregate } from '../aggregates/enterprise/enterprise.aggregate';
import { BaseDomainEvent } from './domain-event.interface';

/**
 * Event emitted when a new enterprise is created
 */
export class EnterpriseCreatedEvent extends BaseDomainEvent {
    public readonly eventType = 'EnterpriseCreated';

    constructor(
        public readonly detail: {
            id: string;
            taxId: string;
            legalBusinessName: string;
            enterpriseType: string;
            contactEmail: string;
            contactPhone?: string;
        }
    ) {
        super();
        // Log in Spanish for diagnostics
        console.log('📦 Evento de creación de empresa generado:', {
            id: this.detail.id,
            empresa: this.detail.legalBusinessName
        });
    }

    /**
     * Create event from enterprise aggregate
     */
    static fromAggregate(enterprise: Enterprise | EnterpriseAggregate): EnterpriseCreatedEvent {
        return new EnterpriseCreatedEvent({
            id: enterprise.id,
            taxId: enterprise.taxId.toString(),
            legalBusinessName: enterprise.legalBusinessName,
            enterpriseType: enterprise.enterpriseType,
            contactEmail: enterprise.contactEmail.toString(),
            contactPhone: enterprise.contactPhone?.toString()
        });
    }

    /**
     * Convert event to EventBridge format
     */
    toEventBridge(): any {
        return {
            Source: 'sistema-bancario.enterprises',
            DetailType: this.eventType,
            Detail: JSON.stringify({
                id: this.detail.id,
                taxId: this.detail.taxId,
                legalBusinessName: this.detail.legalBusinessName,
                enterpriseType: this.detail.enterpriseType,
                contactEmail: this.detail.contactEmail,
                timestamp: new Date().toISOString()
            })
        };
    }
}
