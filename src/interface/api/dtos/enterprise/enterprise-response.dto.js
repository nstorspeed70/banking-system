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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseResponseDto = void 0;
const enterprise_entity_1 = require("../../../../domain/entities/enterprise.entity");
const swagger_1 = require("@nestjs/swagger");
/**
 * DTO for enterprise response
 */
class EnterpriseResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the enterprise',
        example: '1741753120910',
    }),
    __metadata("design:type", String)
], EnterpriseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Legal business name of the enterprise',
        example: 'Example Enterprise Inc.',
    }),
    __metadata("design:type", String)
], EnterpriseResponseDto.prototype, "legalBusinessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax ID of the enterprise',
        example: 'B98765432',
    }),
    __metadata("design:type", String)
], EnterpriseResponseDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of enterprise',
        enum: enterprise_entity_1.EnterpriseType,
        example: 'company',
        enumName: 'EnterpriseType',
    }),
    __metadata("design:type", String)
], EnterpriseResponseDto.prototype, "enterpriseType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact email of the enterprise',
        example: 'contact@example-enterprise.com',
    }),
    __metadata("design:type", String)
], EnterpriseResponseDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact phone number of the enterprise',
        example: '987654321',
    }),
    __metadata("design:type", String)
], EnterpriseResponseDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the enterprise is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], EnterpriseResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation date of the enterprise',
        example: '2025-03-12T04:18:40.910Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], EnterpriseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date of the enterprise',
        example: '2025-03-12T04:18:40.910Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], EnterpriseResponseDto.prototype, "updatedAt", void 0);
exports.EnterpriseResponseDto = EnterpriseResponseDto;
