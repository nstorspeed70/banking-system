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
exports.UpdateEnterpriseDto = void 0;
const class_validator_1 = require("class-validator");
const enterprise_entity_1 = require("../../../../domain/entities/enterprise.entity");
const swagger_1 = require("@nestjs/swagger");
/**
 * DTO for updating an existing enterprise
 */
class UpdateEnterpriseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Legal business name of the enterprise',
        example: 'Updated Example Enterprise Inc.',
        minLength: 3,
        maxLength: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Legal business name must be a string' }),
    (0, class_validator_1.MinLength)(3, { message: 'Legal business name must have at least 3 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Legal business name cannot exceed 100 characters' }),
    __metadata("design:type", String)
], UpdateEnterpriseDto.prototype, "legalBusinessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax ID of the enterprise (between 9 and 15 alphanumeric characters in uppercase)',
        example: 'B87654321',
        pattern: '^[A-Z0-9]{9,15}$',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Tax ID must be a string' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9]{9,15}$/, {
        message: 'Tax ID must contain between 9 and 15 alphanumeric characters in uppercase',
    }),
    __metadata("design:type", String)
], UpdateEnterpriseDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of enterprise',
        enum: enterprise_entity_1.EnterpriseType,
        example: 'company',
        enumName: 'EnterpriseType',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enterprise_entity_1.EnterpriseType, { message: 'Invalid enterprise type' }),
    __metadata("design:type", String)
], UpdateEnterpriseDto.prototype, "enterpriseType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact email of the enterprise',
        example: 'new-contact@example-enterprise.com',
        format: 'email',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    __metadata("design:type", String)
], UpdateEnterpriseDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact phone number of the enterprise',
        example: '987654321',
        minLength: 6,
        maxLength: 20,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Phone must be a string' }),
    (0, class_validator_1.MinLength)(6, { message: 'Phone must have at least 6 characters' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Phone cannot exceed 20 characters' }),
    __metadata("design:type", String)
], UpdateEnterpriseDto.prototype, "contactPhone", void 0);
exports.UpdateEnterpriseDto = UpdateEnterpriseDto;
