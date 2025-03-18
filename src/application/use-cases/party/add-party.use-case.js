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
exports.AddPartyUseCase = void 0;
const common_1 = require("@nestjs/common");
const party_entity_1 = require("../../../domain/entities/party.entity");
const exceptions_1 = require("../../../domain/exceptions");
const repository_module_1 = require("../../../infrastructure/repositories/repository.module");
/**
 * Caso de uso para agregar un nuevo miembro a una empresa
 */
let AddPartyUseCase = class AddPartyUseCase {
    constructor(partyRepository, enterpriseRepository) {
        this.partyRepository = partyRepository;
        this.enterpriseRepository = enterpriseRepository;
    }
    /**
     * Agrega un nuevo miembro a una empresa
     * @param addPartyDto Datos del nuevo miembro
     * @returns El miembro creado
     * @throws EnterpriseNotFoundException si la empresa no existe
     * @throws DuplicateEmailInEnterpriseException si ya existe un miembro con el mismo email en la empresa
     */
    async execute(addPartyDto) {
        await this.verifyEnterpriseExists(addPartyDto.enterpriseId);
        await this.verifyEmailIsUnique(addPartyDto.email, addPartyDto.enterpriseId);
        return this.createParty(addPartyDto);
    }
    /**
     * Verifica que la empresa exista
     */
    async verifyEnterpriseExists(enterpriseId) {
        const existingEnterprise = await this.enterpriseRepository.findById(enterpriseId);
        if (!existingEnterprise) {
            throw new exceptions_1.EnterpriseNotFoundException(enterpriseId);
        }
    }
    /**
     * Verifica que no exista otro miembro con el mismo email en la misma empresa
     */
    async verifyEmailIsUnique(email, enterpriseId) {
        const existingParty = await this.partyRepository.findByEmail(email);
        if (existingParty && existingParty.enterpriseId === enterpriseId) {
            throw new exceptions_1.DuplicateEmailInEnterpriseException(email, enterpriseId);
        }
    }
    /**
     * Crea un nuevo miembro con los datos proporcionados
     */
    createParty(addPartyDto) {
        const party = new party_entity_1.Party({
            name: addPartyDto.name,
            email: addPartyDto.email,
            role: addPartyDto.role,
            enterpriseId: addPartyDto.enterpriseId,
        });
        return this.partyRepository.create(party);
    }
};
AddPartyUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_module_1.PARTY_REPOSITORY)),
    __param(1, (0, common_1.Inject)(repository_module_1.ENTERPRISE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], AddPartyUseCase);
exports.AddPartyUseCase = AddPartyUseCase;
