"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPartyRepository = void 0;
const common_1 = require("@nestjs/common");
/**
 * Implementaciu00f3n en memoria del repositorio de miembros
 */
let InMemoryPartyRepository = class InMemoryPartyRepository {
    constructor() {
        this.parties = [];
    }
    async findAll(filter) {
        let filteredParties = [...this.parties];
        // Aplicar filtros
        if (filter.enterpriseId) {
            filteredParties = filteredParties.filter(p => p.enterpriseId === filter.enterpriseId);
        }
        if (filter.role) {
            filteredParties = filteredParties.filter(p => p.role === filter.role);
        }
        // Calcular paginaciu00f3n
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        return {
            parties: filteredParties.slice(startIndex, endIndex),
            total: filteredParties.length
        };
    }
    async findById(id) {
        return this.parties.find(p => p.id === id) || null;
    }
    async findByEmail(email) {
        return this.parties.find(p => p.email === email) || null;
    }
    async findByEnterpriseId(enterpriseId) {
        return this.parties.filter(p => p.enterpriseId === enterpriseId);
    }
    async findEnterprisesForParty(partyId) {
        const party = this.parties.find(p => p.id === partyId);
        return party ? [party.enterpriseId] : [];
    }
    async create(party) {
        const newParty = Object.assign(Object.assign({}, party), { id: Date.now().toString(), isActive: true, createdAt: new Date(), updatedAt: new Date() });
        this.parties.push(newParty);
        return newParty;
    }
    async update(id, partyData) {
        const index = this.parties.findIndex(p => p.id === id);
        if (index !== -1) {
            this.parties[index] = Object.assign(Object.assign(Object.assign({}, this.parties[index]), partyData), { updatedAt: new Date() });
            return this.parties[index];
        }
        return null;
    }
    async softDelete(id) {
        const index = this.parties.findIndex(p => p.id === id);
        if (index !== -1) {
            this.parties[index].isActive = false;
            this.parties[index].updatedAt = new Date();
        }
    }
};
InMemoryPartyRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryPartyRepository);
exports.InMemoryPartyRepository = InMemoryPartyRepository;
