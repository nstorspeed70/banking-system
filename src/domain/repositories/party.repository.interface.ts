import { PartyAggregate } from '../aggregates/party/party.aggregate';
import { PartyRole } from '../enums/party-role.enum';

export interface PartyFilter {
  enterpriseId?: string;
  role?: PartyRole;
  page?: number;
  limit?: number;
}

export interface IPartyRepository {
  findAll(filter: PartyFilter): Promise<{ parties: PartyAggregate[]; total: number }>;
  findById(id: string): Promise<PartyAggregate | null>;
  findByEmail(email: string): Promise<PartyAggregate | null>;
  findByEnterpriseId(enterpriseId: string): Promise<PartyAggregate[]>;
  findEnterprisesForParty(partyId: string): Promise<string[]>;
  create(party: PartyAggregate): Promise<PartyAggregate>;
  update(id: string, party: Partial<PartyAggregate>): Promise<PartyAggregate | null>;
  softDelete(id: string): Promise<void>;
  enterpriseExists(enterpriseId: string): Promise<boolean>;
}
