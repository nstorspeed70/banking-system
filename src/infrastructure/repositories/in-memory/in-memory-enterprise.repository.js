"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEnterpriseRepository = void 0;
const common_1 = require("@nestjs/common");
/**
 * Implementaciu00f3n en memoria del repositorio de empresas
 */
let InMemoryEnterpriseRepository = class InMemoryEnterpriseRepository {
    constructor() {
        this.enterprises = [];
    }
    async findAll(filter) {
        let filteredEnterprises = [...this.enterprises];
        // Aplicar filtros
        if (filter.enterpriseType) {
            filteredEnterprises = filteredEnterprises.filter(e => e.enterpriseType === filter.enterpriseType);
        }
        // Calcular paginaciu00f3n
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        return {
            enterprises: filteredEnterprises.slice(startIndex, endIndex),
            total: filteredEnterprises.length
        };
    }
    async findById(id) {
        return this.enterprises.find(e => e.id === id) || null;
    }
    async findByTaxId(taxId) {
        return this.enterprises.find(e => e.taxId === taxId) || null;
    }
    async create(enterprise) {
        const newEnterprise = Object.assign(Object.assign({}, enterprise), { id: Date.now().toString(), isActive: true, createdAt: new Date(), updatedAt: new Date() });
        this.enterprises.push(newEnterprise);
        return newEnterprise;
    }
    async update(id, enterpriseData) {
        const index = this.enterprises.findIndex(e => e.id === id);
        if (index !== -1) {
            this.enterprises[index] = Object.assign(Object.assign(Object.assign({}, this.enterprises[index]), enterpriseData), { updatedAt: new Date() });
            return this.enterprises[index];
        }
        return null;
    }
    async softDelete(id) {
        const index = this.enterprises.findIndex(e => e.id === id);
        if (index !== -1) {
            this.enterprises[index].isActive = false;
            this.enterprises[index].updatedAt = new Date();
        }
    }
};
InMemoryEnterpriseRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryEnterpriseRepository);
exports.InMemoryEnterpriseRepository = InMemoryEnterpriseRepository;
