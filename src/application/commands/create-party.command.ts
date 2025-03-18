import { Command } from '../shared/command';
import { PartyRole } from '../../domain/enums/party-role.enum';

export class CreatePartyCommand implements Command {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly role: PartyRole,
        public readonly enterpriseId: string
    ) {}
}
