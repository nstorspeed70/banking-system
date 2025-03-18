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
exports.EnterpriseController = void 0;
const common_1 = require("@nestjs/common");
const create_enterprise_use_case_1 = require("../../../../application/use-cases/enterprise/create-enterprise.use-case");
const delete_enterprise_use_case_1 = require("../../../../application/use-cases/enterprise/delete-enterprise.use-case");
const get_enterprise_use_case_1 = require("../../../../application/use-cases/enterprise/get-enterprise.use-case");
const list_enterprises_use_case_1 = require("../../../../application/use-cases/enterprise/list-enterprises.use-case");
const update_enterprise_use_case_1 = require("../../../../application/use-cases/enterprise/update-enterprise.use-case");
const create_enterprise_dto_1 = require("../../dtos/enterprise/create-enterprise.dto");
const update_enterprise_dto_1 = require("../../dtos/enterprise/update-enterprise.dto");
const filter_enterprise_dto_1 = require("../../dtos/enterprise/filter-enterprise.dto");
const enterprise_response_dto_1 = require("../../dtos/enterprise/enterprise-response.dto");
const swagger_1 = require("@nestjs/swagger");
/**
 * Controlador para gestionar las operaciones CRUD de empresas
 */
let EnterpriseController = class EnterpriseController {
    constructor(createEnterpriseUseCase, getEnterpriseUseCase, updateEnterpriseUseCase, deleteEnterpriseUseCase, listEnterprisesUseCase) {
        this.createEnterpriseUseCase = createEnterpriseUseCase;
        this.getEnterpriseUseCase = getEnterpriseUseCase;
        this.updateEnterpriseUseCase = updateEnterpriseUseCase;
        this.deleteEnterpriseUseCase = deleteEnterpriseUseCase;
        this.listEnterprisesUseCase = listEnterprisesUseCase;
    }
    /**
     * Obtiene un listado de empresas con filtros y paginación
     * @param filterDto Filtros para la búsqueda
     * @returns Lista de empresas y total de resultados
     */
    async findAll(filterDto) {
        const { enterprises, total } = await this.listEnterprisesUseCase.execute(filterDto);
        return {
            data: enterprises.map(enterprise => this.mapToResponseDto(enterprise)),
            meta: {
                total,
                page: filterDto.page || 1,
                limit: filterDto.limit || 10,
                totalPages: Math.ceil(total / (filterDto.limit || 10)),
            },
        };
    }
    /**
     * Obtiene los detalles de una empresa por su ID
     * @param id ID de la empresa
     * @returns Detalles de la empresa
     */
    async findOne(id) {
        const enterprise = await this.getEnterpriseUseCase.execute(id);
        return this.mapToResponseDto(enterprise);
    }
    /**
     * Crea una nueva empresa
     * @param createEnterpriseDto Datos de la nueva empresa
     * @returns La empresa creada
     */
    async create(createEnterpriseDto) {
        const enterprise = await this.createEnterpriseUseCase.execute(createEnterpriseDto);
        return this.mapToResponseDto(enterprise);
    }
    /**
     * Actualiza una empresa existente
     * @param id ID de la empresa a actualizar
     * @param updateEnterpriseDto Datos para actualizar
     * @returns La empresa actualizada
     */
    async update(id, updateEnterpriseDto) {
        const enterprise = await this.updateEnterpriseUseCase.execute(id, updateEnterpriseDto);
        return this.mapToResponseDto(enterprise);
    }
    /**
     * Elimina una empresa (borrado lógico)
     * @param id ID de la empresa a eliminar
     */
    async remove(id) {
        await this.deleteEnterpriseUseCase.execute(id);
    }
    /**
     * Mapea una entidad Enterprise a un DTO de respuesta
     */
    mapToResponseDto(enterprise) {
        return new enterprise_response_dto_1.EnterpriseResponseDto({
            id: enterprise.id,
            legalBusinessName: enterprise.legalBusinessName,
            taxId: enterprise.taxId,
            enterpriseType: enterprise.enterpriseType,
            contactEmail: enterprise.contactEmail,
            contactPhone: enterprise.contactPhone,
            isActive: enterprise.isActive,
            createdAt: enterprise.createdAt,
            updatedAt: enterprise.updatedAt,
        });
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get list of enterprises', description: 'Retrieves a list of enterprises with support for filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enterprise list retrieved successfully', type: enterprise_response_dto_1.EnterpriseResponseDto, isArray: true }),
    (0, swagger_1.ApiQuery)({ name: 'enterpriseType', required: false, enum: ['company', 'individual'], description: 'Filter by enterprise type' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of items per page' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_enterprise_dto_1.FilterEnterpriseDto]),
    __metadata("design:returntype", Promise)
], EnterpriseController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get enterprise by ID', description: 'Retrieves the details of a specific enterprise by its identifier' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Unique identifier of the enterprise' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enterprise found', type: enterprise_response_dto_1.EnterpriseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enterprise not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnterpriseController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new enterprise', description: 'Creates a new enterprise with the provided data' }),
    (0, swagger_1.ApiBody)({ type: create_enterprise_dto_1.CreateEnterpriseDto, description: 'Data to create the enterprise' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Enterprise created successfully', type: enterprise_response_dto_1.EnterpriseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate Tax ID' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enterprise_dto_1.CreateEnterpriseDto]),
    __metadata("design:returntype", Promise)
], EnterpriseController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update enterprise', description: 'Updates the data of an existing enterprise' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Unique identifier of the enterprise to update' }),
    (0, swagger_1.ApiBody)({ type: update_enterprise_dto_1.UpdateEnterpriseDto, description: 'Data to update the enterprise' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enterprise updated successfully', type: enterprise_response_dto_1.EnterpriseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enterprise not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate Tax ID' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_enterprise_dto_1.UpdateEnterpriseDto]),
    __metadata("design:returntype", Promise)
], EnterpriseController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete enterprise', description: 'Performs a logical deletion of an enterprise' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Unique identifier of the enterprise to delete' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Enterprise deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enterprise not found' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnterpriseController.prototype, "remove", null);
EnterpriseController = __decorate([
    (0, swagger_1.ApiTags)('Empresas'),
    (0, common_1.Controller)('enterprises'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [create_enterprise_use_case_1.CreateEnterpriseUseCase,
        get_enterprise_use_case_1.GetEnterpriseUseCase,
        update_enterprise_use_case_1.UpdateEnterpriseUseCase,
        delete_enterprise_use_case_1.DeleteEnterpriseUseCase,
        list_enterprises_use_case_1.ListEnterprisesUseCase])
], EnterpriseController);
exports.EnterpriseController = EnterpriseController;
