"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEnterpriseCommand = void 0;
/**
 * Comando para crear una nueva empresa
 */
class CreateEnterpriseCommand {
    constructor(legalBusinessName, taxId, enterpriseType, contactEmail, contactPhone) {
        this.legalBusinessName = legalBusinessName;
        this.taxId = taxId;
        this.enterpriseType = enterpriseType;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
    }
}
exports.CreateEnterpriseCommand = CreateEnterpriseCommand;
