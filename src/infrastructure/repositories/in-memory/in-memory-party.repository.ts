import { Injectable } from '@nestjs/common';
import { PartyAggregate } from '../../../domain/aggregates/party/party.aggregate';
import { IPartyRepository, PartyFilter } from '../../../domain/repositories/party.repository.interface';
import { PartyRole } from '../../../domain/enums/party-role.enum';

/**
 * Implementación en memoria del repositorio de miembros
 */
@Injectable()
export class InMemoryPartyRepository implements IPartyRepository {
  private parties: PartyAggregate[] = [];

  async findAll(filter: PartyFilter): Promise<{ parties: PartyAggregate[]; total: number }> {
    let filteredParties = [...this.parties];
    
    // Aplicar filtros
    if (filter.enterpriseId) {
      filteredParties = filteredParties.filter(p => p.enterpriseId === filter.enterpriseId);
    }
    
    if (filter.role) {
      filteredParties = filteredParties.filter(p => p.role === filter.role);
    }
    
    // Calcular paginación
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return { 
      parties: filteredParties.slice(startIndex, endIndex), 
      total: filteredParties.length 
    };
  }

  async findById(id: string): Promise<PartyAggregate | null> {
    return this.parties.find(p => p.id === id) || null;
  }

  async findByEmail(email: string): Promise<PartyAggregate | null> {
    return this.parties.find(p => p.email.toString() === email) || null;
  }

  async findByEnterpriseId(enterpriseId: string): Promise<PartyAggregate[]> {
    return this.parties.filter(p => p.enterpriseId === enterpriseId);
  }

  async findEnterprisesForParty(partyId: string): Promise<string[]> {
    const party = this.parties.find(p => p.id === partyId);
    return party ? [party.enterpriseId] : [];
  }

  async create(party: PartyAggregate): Promise<PartyAggregate> {
    this.parties.push(party);
    return party;
  }

  async update(id: string, partyData: Partial<PartyAggregate>): Promise<PartyAggregate | null> {
    const party = await this.findById(id);
    if (party) {
      party.update(
        partyData.name,
        partyData.email?.toString(),
        partyData.role as PartyRole
      );
      return party;
    }
    return null;
  }

  async softDelete(id: string): Promise<void> {
    const party = await this.findById(id);
    if (party) {
      party.delete();
    }
  }

  async enterpriseExists(enterpriseId: string): Promise<boolean> {
    // En una implementación real, esto debería verificar contra el repositorio de empresas
    return true;
  }
}
