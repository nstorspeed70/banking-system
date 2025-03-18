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
exports.FilterEnterpriseDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enterprise_entity_1 = require("../../../../domain/entities/enterprise.entity");
const swagger_1 = require("@nestjs/swagger");
/**
 * DTO for filtering enterprises in the list
 */
class FilterEnterpriseDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by enterprise type',
        enum: enterprise_entity_1.EnterpriseType,
        example: 'company',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enterprise_entity_1.EnterpriseType, { message: 'Invalid enterprise type' }),
    __metadata("design:type", String)
], FilterEnterpriseDto.prototype, "enterpriseType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        example: 1,
        default: 1,
        minimum: 1,
        type: Number,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Page must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be greater than or equal to 1' }),
    __metadata("design:type", Number)
], FilterEnterpriseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10,
        default: 10,
        minimum: 1,
        type: Number,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Limit must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be greater than or equal to 1' }),
    __metadata("design:type", Number)
], FilterEnterpriseDto.prototype, "limit", void 0);
exports.FilterEnterpriseDto = FilterEnterpriseDto;
