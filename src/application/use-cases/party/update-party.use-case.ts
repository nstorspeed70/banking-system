import { Inject, Injectable } from '@nestjs/common';
import { PartyRole } from '../../../domain/enums/party-role.enum';
import { PartyAggregate } from '../../../domain/aggregates/party/party.aggregate';
import { IPartyRepository } from '../../../domain/repositories/party.repository.interface';
import { PartyNotFoundException, DuplicateEmailInEnterpriseException } from '../../../domain/exceptions';
import { PARTY_REPOSITORY } from '../../../infrastructure/repositories/repository.module';

export interface UpdatePartyDto {
  name?: string;
  email?: string;
  role?: PartyRole;
}

/**
 * Caso de uso para actualizar los datos de un miembro
 */
@Injectable()
export class UpdatePartyUseCase {
  constructor(
    @Inject(PARTY_REPOSITORY)
    private readonly partyRepository: IPartyRepository,
  ) {}

  /**
   * Actualiza los datos de un miembro existente
   * @param id ID del miembro a actualizar
   * @param enterpriseId Identificador de la empresa a la que pertenece el miembro
   * @param updatePartyDto Datos a actualizar
   * @returns El miembro actualizado
   * @throws PartyNotFoundException si el miembro no existe
   * @throws DuplicateEmailInEnterpriseException si el nuevo email ya existe en la empresa
   */
  async execute(id: string, enterpriseId: string, updatePartyDto: UpdatePartyDto): Promise<PartyAggregate> {
    const existingParty = await this.findPartyOrFail(id);
    this.verifyPartyBelongsToEnterprise(existingParty, enterpriseId);
    
    if (updatePartyDto.email) {
      await this.verifyEmailIsUnique(updatePartyDto.email, existingParty.enterpriseId, id);
    }

    existingParty.update(
      updatePartyDto.name,
      updatePartyDto.email,
      updatePartyDto.role
    );

    existingParty.validate();
    return existingParty;
  }

  /**
   * Busca un miembro por su ID o lanza una excepción si no existe
   */
  private async findPartyOrFail(id: string): Promise<PartyAggregate> {
    const party = await this.partyRepository.findById(id);
    
    if (!party) {
      throw new PartyNotFoundException(id);
    }
    
    return party;
  }

  /**
   * Verifica que el miembro pertenezca a la empresa especificada
   */
  private verifyPartyBelongsToEnterprise(party: PartyAggregate, enterpriseId: string): void {
    if (party.enterpriseId !== enterpriseId) {
      throw new Error('PartyNotInEnterpriseException'); // Esta excepción no se encontraba en el código original
    }
  }

  /**
   * Verifica que no exista otro miembro con el mismo email en la misma empresa
   */
  private async verifyEmailIsUnique(email: string, enterpriseId: string, currentPartyId: string): Promise<void> {
    const existingParty = await this.partyRepository.findByEmail(email);
    
    if (existingParty && 
        existingParty.enterpriseId === enterpriseId && 
        existingParty.id !== currentPartyId) {
      throw new DuplicateEmailInEnterpriseException(email, enterpriseId);
    }
  }
}
