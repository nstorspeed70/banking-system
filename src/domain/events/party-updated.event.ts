import { DomainEvent } from '../shared/domain-event';
import { PartyAggregate } from '../aggregates/party/party.aggregate';

export class PartyUpdatedEvent implements DomainEvent {
    constructor(public readonly party: PartyAggregate) {}

    eventName(): string {
        return 'PartyUpdated';
    }

    timestamp(): Date {
        return new Date();
    }

    payload(): any {
        return {
            partyId: this.party.id,
            name: this.party.name,
            email: this.party.email.value,
            role: this.party.role,
            enterpriseId: this.party.enterpriseId,
            updatedAt: this.party.updatedAt
        };
    }
}
