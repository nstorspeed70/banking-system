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
exports.CreateEnterpriseUseCase = void 0;
const common_1 = require("@nestjs/common");
const enterprise_entity_1 = require("../../../domain/entities/enterprise.entity");
const exceptions_1 = require("../../../domain/exceptions");
const repository_module_1 = require("../../../infrastructure/repositories/repository.module");
// Constantes para validación
const TAX_ID_PATTERN = /^[A-Z0-9]{9,15}$/;
/**
 * Caso de uso para crear una nueva empresa
 */
let CreateEnterpriseUseCase = class CreateEnterpriseUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    /**
     * Crea una nueva empresa con los datos proporcionados
     * @param createEnterpriseDto Datos de la nueva empresa
     * @returns La empresa creada
     * @throws DuplicateTaxIdException si ya existe una empresa con el mismo taxId
     * @throws InvalidTaxIdFormatException si el formato del taxId es inválido
     */
    async execute(createEnterpriseDto) {
        await this.verifyTaxIdIsUnique(createEnterpriseDto.taxId);
        this.validateTaxIdFormat(createEnterpriseDto.taxId);
        return this.createEnterprise(createEnterpriseDto);
    }
    /**
     * Verifica que no exista otra empresa con el mismo taxId
     */
    async verifyTaxIdIsUnique(taxId) {
        const existingEnterprise = await this.enterpriseRepository.findByTaxId(taxId);
        if (existingEnterprise) {
            throw new exceptions_1.DuplicateTaxIdException(taxId);
        }
    }
    /**
     * Valida el formato del taxId
     */
    validateTaxIdFormat(taxId) {
        if (!TAX_ID_PATTERN.test(taxId)) {
            throw new exceptions_1.InvalidTaxIdFormatException(taxId);
        }
    }
    /**
     * Crea una nueva empresa con los datos proporcionados
     */
    createEnterprise(createEnterpriseDto) {
        const enterprise = new enterprise_entity_1.Enterprise({
            legalBusinessName: createEnterpriseDto.legalBusinessName,
            taxId: createEnterpriseDto.taxId,
            enterpriseType: createEnterpriseDto.enterpriseType,
            contactEmail: createEnterpriseDto.contactEmail,
            contactPhone: createEnterpriseDto.contactPhone,
        });
        return this.enterpriseRepository.create(enterprise);
    }
};
CreateEnterpriseUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_module_1.ENTERPRISE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateEnterpriseUseCase);
exports.CreateEnterpriseUseCase = CreateEnterpriseUseCase;
