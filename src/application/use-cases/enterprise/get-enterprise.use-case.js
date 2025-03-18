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
exports.GetEnterpriseUseCase = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../../domain/exceptions");
const repository_module_1 = require("../../../infrastructure/repositories/repository.module");
/**
 * Caso de uso para obtener una empresa por su ID
 */
let GetEnterpriseUseCase = class GetEnterpriseUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    /**
     * Obtiene una empresa por su ID
     * @param id Identificador de la empresa
     * @returns La empresa encontrada
     * @throws EnterpriseNotFoundException si la empresa no existe
     */
    async execute(id) {
        const enterprise = await this.enterpriseRepository.findById(id);
        if (!enterprise) {
            throw new exceptions_1.EnterpriseNotFoundException(id);
        }
        return enterprise;
    }
};
GetEnterpriseUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_module_1.ENTERPRISE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetEnterpriseUseCase);
exports.GetEnterpriseUseCase = GetEnterpriseUseCase;
