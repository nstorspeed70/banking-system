// Excepciones de Enterprise
export class EnterpriseNotFoundException extends Error {
  constructor(id: string) {
    super(`Empresa con ID ${id} no encontrada`);
    this.name = 'EnterpriseNotFoundException';
  }
}

export class DuplicateTaxIdException extends Error {
  constructor(taxId: string) {
    super(`Ya existe una empresa con el RUC ${taxId}`);
    this.name = 'DuplicateTaxIdException';
  }
}

export class InvalidTaxIdFormatException extends Error {
  constructor(taxId: string) {
    super(`El RUC ${taxId} no es válido`);
    this.name = 'InvalidTaxIdFormatException';
  }
}

// Excepciones de Party
export class PartyNotFoundException extends Error {
  constructor(id: string) {
    super(`Miembro no encontrado con ID: ${id}`);
    this.name = 'PartyNotFoundException';
  }
}

export class PartyNotInEnterpriseException extends Error {
  constructor(partyId: string, enterpriseId: string) {
    super(`El miembro ${partyId} no pertenece a la empresa ${enterpriseId}`);
    this.name = 'PartyNotInEnterpriseException';
  }
}

export class DuplicateEmailInEnterpriseException extends Error {
  constructor(email: string, enterpriseId: string) {
    super(`Ya existe otro miembro con el email ${email} en la empresa ${enterpriseId}`);
    this.name = 'DuplicateEmailInEnterpriseException';
  }
}
