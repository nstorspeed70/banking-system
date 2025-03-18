"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryModule = exports.PARTY_REPOSITORY = exports.ENTERPRISE_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
// Tokens para inyecciu00f3n de dependencias
exports.ENTERPRISE_REPOSITORY = 'ENTERPRISE_REPOSITORY';
exports.PARTY_REPOSITORY = 'PARTY_REPOSITORY';
// Importar las implementaciones de los repositorios
const in_memory_enterprise_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-enterprise.repository");
const in_memory_party_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-party.repository");
/**
 * Mu00f3dulo que proporciona las implementaciones de los repositorios
 */
let RepositoryModule = class RepositoryModule {
};
RepositoryModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.ENTERPRISE_REPOSITORY,
                useClass: in_memory_enterprise_repository_1.InMemoryEnterpriseRepository,
            },
            {
                provide: exports.PARTY_REPOSITORY,
                useClass: in_memory_party_repository_1.InMemoryPartyRepository,
            },
        ],
        exports: [
            {
                provide: exports.ENTERPRISE_REPOSITORY,
                useClass: in_memory_enterprise_repository_1.InMemoryEnterpriseRepository,
            },
            {
                provide: exports.PARTY_REPOSITORY,
                useClass: in_memory_party_repository_1.InMemoryPartyRepository,
            },
        ],
    })
], RepositoryModule);
exports.RepositoryModule = RepositoryModule;
