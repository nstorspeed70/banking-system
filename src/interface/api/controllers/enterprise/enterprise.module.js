"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseModule = void 0;
const common_1 = require("@nestjs/common");
const enterprise_controller_1 = require("./enterprise.controller");
const create_enterprise_use_case_1 = require("../../../../application/use-cases/enterprise/create-enterprise.use-case");
const delete_enterprise_use_case_1 = require("../../../../application/use-cases/enterprise/delete-enterprise.use-case");
const get_enterprise_use_case_1 = require("../../../../application/use-cases/enterprise/get-enterprise.use-case");
const list_enterprises_use_case_1 = require("../../../../application/use-cases/enterprise/list-enterprises.use-case");
const update_enterprise_use_case_1 = require("../../../../application/use-cases/enterprise/update-enterprise.use-case");
const repository_module_1 = require("../../../../infrastructure/repositories/repository.module");
/**
 * Módulo para la gestión de empresas
 */
let EnterpriseModule = class EnterpriseModule {
};
EnterpriseModule = __decorate([
    (0, common_1.Module)({
        controllers: [enterprise_controller_1.EnterpriseController],
        providers: [
            create_enterprise_use_case_1.CreateEnterpriseUseCase,
            delete_enterprise_use_case_1.DeleteEnterpriseUseCase,
            get_enterprise_use_case_1.GetEnterpriseUseCase,
            list_enterprises_use_case_1.ListEnterprisesUseCase,
            update_enterprise_use_case_1.UpdateEnterpriseUseCase,
        ],
        imports: [repository_module_1.RepositoryModule],
    })
], EnterpriseModule);
exports.EnterpriseModule = EnterpriseModule;
