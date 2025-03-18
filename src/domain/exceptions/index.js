"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateEmailInEnterpriseException = exports.PartyNotInEnterpriseException = exports.PartyNotFoundException = exports.InvalidTaxIdFormatException = exports.DuplicateTaxIdException = exports.EnterpriseNotFoundException = void 0;
// Excepciones de Enterprise
class EnterpriseNotFoundException extends Error {
    constructor(id) {
        super(`Empresa no encontrada con ID: ${id}`);
        this.name = 'EnterpriseNotFoundException';
    }
}
exports.EnterpriseNotFoundException = EnterpriseNotFoundException;
class DuplicateTaxIdException extends Error {
    constructor(taxId) {
        super(`Ya existe otra empresa con este ID fiscal: ${taxId}`);
        this.name = 'DuplicateTaxIdException';
    }
}
exports.DuplicateTaxIdException = DuplicateTaxIdException;
class InvalidTaxIdFormatException extends Error {
    constructor(taxId) {
        super(`Formato de ID fiscal inválido: ${taxId}`);
        this.name = 'InvalidTaxIdFormatException';
    }
}
exports.InvalidTaxIdFormatException = InvalidTaxIdFormatException;
// Excepciones de Party
class PartyNotFoundException extends Error {
    constructor(id) {
        super(`Miembro no encontrado con ID: ${id}`);
        this.name = 'PartyNotFoundException';
    }
}
exports.PartyNotFoundException = PartyNotFoundException;
class PartyNotInEnterpriseException extends Error {
    constructor(partyId, enterpriseId) {
        super(`El miembro ${partyId} no pertenece a la empresa ${enterpriseId}`);
        this.name = 'PartyNotInEnterpriseException';
    }
}
exports.PartyNotInEnterpriseException = PartyNotInEnterpriseException;
class DuplicateEmailInEnterpriseException extends Error {
    constructor(email, enterpriseId) {
        super(`Ya existe otro miembro con el email ${email} en la empresa ${enterpriseId}`);
        this.name = 'DuplicateEmailInEnterpriseException';
    }
}
exports.DuplicateEmailInEnterpriseException = DuplicateEmailInEnterpriseException;
