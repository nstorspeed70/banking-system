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
exports.UpdateEnterpriseUseCase = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../../domain/exceptions");
const repository_module_1 = require("../../../infrastructure/repositories/repository.module");
// Constantes para validación
const TAX_ID_PATTERN = /^[A-Z0-9]{9,15}$/;
/**
 * Caso de uso para actualizar la información de una empresa
 */
let UpdateEnterpriseUseCase = class UpdateEnterpriseUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    /**
     * Actualiza una empresa existente con los datos proporcionados
     * @param id Identificador de la empresa a actualizar
     * @param updateEnterpriseDto Datos para actualizar la empresa
     * @returns La empresa actualizada
     * @throws EnterpriseNotFoundException si la empresa no existe
     * @throws DuplicateTaxIdException si el taxId ya está en uso por otra empresa
     * @throws InvalidTaxIdFormatException si el formato del taxId es inválido
     */
    async execute(id, updateEnterpriseDto) {
        const existingEnterprise = await this.findEnterpriseOrFail(id);
        await this.validateTaxIdIfChanged(id, existingEnterprise, updateEnterpriseDto);
        const updatedEnterprise = await this.enterpriseRepository.update(id, updateEnterpriseDto);
        if (!updatedEnterprise) {
            throw new exceptions_1.EnterpriseNotFoundException(id);
        }
        return updatedEnterprise;
    }
    /**
     * Busca una empresa por su ID o lanza una excepción si no existe
     */
    async findEnterpriseOrFail(id) {
        const enterprise = await this.enterpriseRepository.findById(id);
        if (!enterprise) {
            throw new exceptions_1.EnterpriseNotFoundException(id);
        }
        return enterprise;
    }
    /**
     * Valida el taxId si ha sido modificado
     */
    async validateTaxIdIfChanged(id, existingEnterprise, updateDto) {
        if (!this.isTaxIdChanged(existingEnterprise, updateDto)) {
            return;
        }
        // Asegurarse de que taxId no sea undefined antes de usarlo
        if (updateDto.taxId) {
            await this.checkTaxIdUniqueness(id, updateDto.taxId);
            this.validateTaxIdFormat(updateDto.taxId);
        }
    }
    /**
     * Determina si el taxId ha sido modificado
     */
    isTaxIdChanged(existingEnterprise, updateDto) {
        return Boolean(updateDto.taxId && updateDto.taxId !== existingEnterprise.taxId);
    }
    /**
     * Verifica que el taxId no esté siendo usado por otra empresa
     */
    async checkTaxIdUniqueness(currentEnterpriseId, taxId) {
        const enterpriseWithSameTaxId = await this.enterpriseRepository.findByTaxId(taxId);
        if (enterpriseWithSameTaxId && enterpriseWithSameTaxId.id !== currentEnterpriseId) {
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
};
UpdateEnterpriseUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_module_1.ENTERPRISE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdateEnterpriseUseCase);
exports.UpdateEnterpriseUseCase = UpdateEnterpriseUseCase;
