import { Inject, Injectable } from '@nestjs/common';
import { PartyRole } from '../../../domain/enums/party-role.enum';
import { PartyAggregate } from '../../../domain/aggregates/party/party.aggregate';
import { IPartyRepository } from '../../../domain/repositories/party.repository.interface';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { EnterpriseNotFoundException, DuplicateEmailInEnterpriseException } from '../../../domain/exceptions';
import { ENTERPRISE_REPOSITORY, PARTY_REPOSITORY } from '../../../infrastructure/repositories/repository.module';

export interface AddPartyDto {
  name: string;
  email: string;
  role: PartyRole;
  enterpriseId: string;
}

/**
 * Caso de uso para agregar un nuevo miembro a una empresa
 */
@Injectable()
export class AddPartyUseCase {
  constructor(
    @Inject(PARTY_REPOSITORY)
    private readonly partyRepository: IPartyRepository,
    @Inject(ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  /**
   * Agrega un nuevo miembro a una empresa
   * @param addPartyDto Datos del nuevo miembro
   * @returns El miembro creado
   * @throws EnterpriseNotFoundException si la empresa no existe
   * @throws DuplicateEmailInEnterpriseException si ya existe un miembro con el mismo email en la empresa
   */
  async execute(addPartyDto: AddPartyDto): Promise<PartyAggregate> {
    await this.verifyEnterpriseExists(addPartyDto.enterpriseId);
    await this.verifyEmailIsUnique(addPartyDto.email, addPartyDto.enterpriseId);
    
    return this.createParty(addPartyDto);
  }

  /**
   * Verifica que la empresa exista
   */
  private async verifyEnterpriseExists(enterpriseId: string): Promise<void> {
    const existingEnterprise = await this.enterpriseRepository.findById(enterpriseId);
    
    if (!existingEnterprise) {
      throw new EnterpriseNotFoundException(enterpriseId);
    }
  }

  /**
   * Verifica que no exista otro miembro con el mismo email en la misma empresa
   */
  private async verifyEmailIsUnique(email: string, enterpriseId: string): Promise<void> {
    const existingParty = await this.partyRepository.findByEmail(email);
    
    if (existingParty && existingParty.enterpriseId === enterpriseId) {
      throw new DuplicateEmailInEnterpriseException(email, enterpriseId);
    }
  }

  /**
   * Crea un nuevo miembro con los datos proporcionados
   */
  private async createParty(addPartyDto: AddPartyDto): Promise<PartyAggregate> {
    const party = PartyAggregate.create(
      Date.now().toString(), // ID temporal, en producción usar UUID
      addPartyDto.name,
      addPartyDto.email,
      addPartyDto.role,
      addPartyDto.enterpriseId
    );

    party.validate();
    return this.partyRepository.create(party);
  }
}
