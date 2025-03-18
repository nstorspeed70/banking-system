export enum EnterpriseType {
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}

export class Enterprise {
  id: string | undefined;
  legalBusinessName: string;
  taxId: string;
  enterpriseType: EnterpriseType;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id?: string;
    legalBusinessName: string;
    taxId: string;
    enterpriseType: EnterpriseType;
    contactEmail: string;
    contactPhone: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.legalBusinessName = params.legalBusinessName;
    this.taxId = params.taxId;
    this.enterpriseType = params.enterpriseType;
    this.contactEmail = params.contactEmail;
    this.contactPhone = params.contactPhone;
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
