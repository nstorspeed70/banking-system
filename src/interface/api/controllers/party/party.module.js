"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyModule = void 0;
const common_1 = require("@nestjs/common");
const party_controller_1 = require("./party.controller");
const add_party_use_case_1 = require("../../../../application/use-cases/party/add-party.use-case");
const update_party_use_case_1 = require("../../../../application/use-cases/party/update-party.use-case");
const repository_module_1 = require("../../../../infrastructure/repositories/repository.module");
/**
 * Módulo para la gestión de miembros de empresas
 */
let PartyModule = class PartyModule {
};
PartyModule = __decorate([
    (0, common_1.Module)({
        controllers: [party_controller_1.PartyController],
        providers: [
            add_party_use_case_1.AddPartyUseCase,
            update_party_use_case_1.UpdatePartyUseCase,
        ],
        imports: [repository_module_1.RepositoryModule],
    })
], PartyModule);
exports.PartyModule = PartyModule;
