"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePartyUseCase = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../../domain/exceptions");
const repository_module_1 = require("../../../infrastructure/repositories/repository.module");
/**
 * Caso de uso para actualizar la información de un miembro
 */
let UpdatePartyUseCase = class UpdatePartyUseCase {
    constructor(partyRepository) {
        this.partyRepository = partyRepository;
    }
    /**
     * Actualiza la información de un miembro existente
     * @param id Identificador del miembro a actualizar
     * @param enterpriseId Identificador de la empresa a la que pertenece el miembro
     * @param updatePartyDto Datos para actualizar el miembro
     * @returns El miembro actualizado
     * @throws PartyNotFoundException si el miembro no existe
     * @throws PartyNotInEnterpriseException si el miembro no pertenece a la empresa especificada
     * @throws DuplicateEmailInEnterpriseException si ya existe otro miembro con el mismo email en la empresa
     */
    async execute(id, enterpriseId, updatePartyDto) {
        const existingParty = await this.findPartyOrFail(id);
        this.verifyPartyBelongsToEnterprise(existingParty, enterpriseId);
        await this.verifyEmailIsUniqueIfChanged(id, enterpriseId, existingParty, updatePartyDto);
        const updatedParty = await this.partyRepository.update(id, updatePartyDto);
        if (!updatedParty) {
            throw new exceptions_1.PartyNotFoundException(id);
        }
        return updatedParty;
    }
    /**
     * Busca un miembro por su ID o lanza una excepción si no existe
     */
    async findPartyOrFail(id) {
        const party = await this.partyRepository.findById(id);
        if (!party) {
            throw new exceptions_1.PartyNotFoundException(id);
        }
        return party;
    }
    /**
     * Verifica que el miembro pertenezca a la empresa especificada
     */
    verifyPartyBelongsToEnterprise(party, enterpriseId) {
        if (party.enterpriseId !== enterpriseId) {
            throw new exceptions_1.PartyNotInEnterpriseException(party.id || '', enterpriseId);
        }
    }
    /**
     * Verifica que no exista otro miembro con el mismo email en la misma empresa
     * si se está actualizando el email
     */
    async verifyEmailIsUniqueIfChanged(partyId, enterpriseId, existingParty, updatePartyDto) {
        // Si no se actualiza el email o es el mismo, no hay que validar
        if (!updatePartyDto.email || updatePartyDto.email === existingParty.email) {
            return;
        }
        // Ahora sabemos que updatePartyDto.email no es undefined
        const email = updatePartyDto.email;
        const partyWithSameEmail = await this.partyRepository.findByEmail(email);
        if (partyWithSameEmail &&
            partyWithSameEmail.id !== partyId &&
            partyWithSameEmail.enterpriseId === enterpriseId) {
            throw new exceptions_1.DuplicateEmailInEnterpriseException(email, enterpriseId);
        }
    }
};
UpdatePartyUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_module_1.PARTY_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdatePartyUseCase);
exports.UpdatePartyUseCase = UpdatePartyUseCase;
