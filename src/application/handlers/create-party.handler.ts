import { CommandHandler } from '../shared/command-handler';
import { CreatePartyCommand } from '../commands/create-party.command';
import { PartyAggregate } from '../../domain/aggregates/party/party.aggregate';
import { IPartyRepository } from '../../domain/repositories/party.repository.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Manejador del comando para crear un nuevo miembro
 */
export class CreatePartyHandler implements CommandHandler<CreatePartyCommand> {
    constructor(private readonly partyRepository: IPartyRepository) {}

    async execute(command: CreatePartyCommand): Promise<string> {
        // Validar que la empresa existe
        const enterpriseExists = await this.partyRepository.enterpriseExists(command.enterpriseId);
        if (!enterpriseExists) {
            throw new Error('La empresa especificada no existe');
        }

        // Validar que el email no esté duplicado
        const existingParty = await this.partyRepository.findByEmail(command.email);
        if (existingParty) {
            throw new Error('Ya existe un miembro con este email');
        }

        // Crear el agregado Party usando el factory method
        const party = PartyAggregate.create(
            uuidv4(),
            command.name,
            command.email,
            command.role,
            command.enterpriseId
        );

        // Validar el agregado
        party.validate();

        // Persistir y publicar eventos
        await this.partyRepository.create(party);

        // Retornar el ID del nuevo miembro
        return party.id;
    }
}
