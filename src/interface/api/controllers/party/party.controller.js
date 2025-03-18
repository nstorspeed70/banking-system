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
exports.PartyController = void 0;
const common_1 = require("@nestjs/common");
const add_party_use_case_1 = require("../../../../application/use-cases/party/add-party.use-case");
const update_party_use_case_1 = require("../../../../application/use-cases/party/update-party.use-case");
const create_party_dto_1 = require("../../dtos/party/create-party.dto");
const update_party_dto_1 = require("../../dtos/party/update-party.dto");
const party_response_dto_1 = require("../../dtos/party/party-response.dto");
const swagger_1 = require("@nestjs/swagger");
/**
 * Controller for managing enterprise party operations
 */
let PartyController = class PartyController {
    constructor(addPartyUseCase, updatePartyUseCase) {
        this.addPartyUseCase = addPartyUseCase;
        this.updatePartyUseCase = updatePartyUseCase;
    }
    /**
     * Get all parties of an enterprise
     * @param enterpriseId Enterprise ID
     * @returns List of parties of the enterprise
     */
    async findAllByEnterprise(enterpriseId) {
        // Here we would implement a use case to get all parties of an enterprise
        // As we don't have that use case implemented, we return an empty array
        return {
            data: [],
            meta: {
                total: 0,
            },
        };
    }
    /**
     * Get all enterprises associated with a party
     * @param partyId Party ID
     * @returns List of enterprises associated with the party
     */
    async findEnterprisesByParty(partyId) {
        // Here we would implement a use case to get all enterprises associated with a party
        // As we don't have that use case implemented, we return an empty array
        return {
            data: [],
            meta: {
                total: 0,
            },
        };
    }
    /**
     * Add a new party to an enterprise
     * @param enterpriseId Enterprise ID
     * @param createPartyDto Data for the new party
     * @returns The created party
     */
    async create(enterpriseId, createPartyDto) {
        // Ensure the enterpriseId in the DTO matches the one in the URL
        const partyData = Object.assign(Object.assign({}, createPartyDto), { enterpriseId });
        const party = await this.addPartyUseCase.execute(partyData);
        return this.mapToResponseDto(party);
    }
    /**
     * Update an existing party of an enterprise
     * @param enterpriseId Enterprise ID
     * @param partyId Party ID
     * @param updatePartyDto Data to update
     * @returns The updated party
     */
    async update(enterpriseId, partyId, updatePartyDto) {
        const party = await this.updatePartyUseCase.execute(partyId, enterpriseId, updatePartyDto);
        return this.mapToResponseDto(party);
    }
    /**
     * Maps a Party entity to a response DTO
     */
    mapToResponseDto(party) {
        return new party_response_dto_1.PartyResponseDto({
            id: party.id,
            name: party.name,
            email: party.email,
            role: party.role,
            enterpriseId: party.enterpriseId,
            isActive: party.isActive,
            createdAt: party.createdAt,
            updatedAt: party.updatedAt,
        });
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get parties of an enterprise', description: 'Retrieves all parties associated with a specific enterprise' }),
    (0, swagger_1.ApiParam)({ name: 'enterpriseId', description: 'Unique identifier of the enterprise' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Party list retrieved successfully', type: party_response_dto_1.PartyResponseDto, isArray: true }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enterprise not found' }),
    (0, common_1.Get)('enterprises/:enterpriseId/parties'),
    __param(0, (0, common_1.Param)('enterpriseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "findAllByEnterprise", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get enterprises of a party', description: 'Retrieves all enterprises a specific party belongs to' }),
    (0, swagger_1.ApiParam)({ name: 'partyId', description: 'Unique identifier of the party' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enterprise list retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Party not found' }),
    (0, common_1.Get)('parties/:partyId/enterprises'),
    __param(0, (0, common_1.Param)('partyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "findEnterprisesByParty", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add party to enterprise', description: 'Adds a new party to an existing enterprise' }),
    (0, swagger_1.ApiParam)({ name: 'enterpriseId', description: 'Unique identifier of the enterprise' }),
    (0, swagger_1.ApiBody)({ type: create_party_dto_1.CreatePartyDto, description: 'Data for the new party' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Party created successfully', type: party_response_dto_1.PartyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enterprise not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate email in the enterprise' }),
    (0, common_1.Post)('enterprises/:enterpriseId/parties'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('enterpriseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_party_dto_1.CreatePartyDto]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update party', description: 'Updates the data of an existing party in an enterprise' }),
    (0, swagger_1.ApiParam)({ name: 'enterpriseId', description: 'Unique identifier of the enterprise' }),
    (0, swagger_1.ApiParam)({ name: 'partyId', description: 'Unique identifier of the party' }),
    (0, swagger_1.ApiBody)({ type: update_party_dto_1.UpdatePartyDto, description: 'Data to update the party' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Party updated successfully', type: party_response_dto_1.PartyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enterprise or party not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate email in the enterprise' }),
    (0, common_1.Put)('enterprises/:enterpriseId/parties/:partyId'),
    __param(0, (0, common_1.Param)('enterpriseId')),
    __param(1, (0, common_1.Param)('partyId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_party_dto_1.UpdatePartyDto]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "update", null);
PartyController = __decorate([
    (0, swagger_1.ApiTags)('Parties'),
    (0, common_1.Controller)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [add_party_use_case_1.AddPartyUseCase,
        update_party_use_case_1.UpdatePartyUseCase])
], PartyController);
exports.PartyController = PartyController;
