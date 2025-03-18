export enum PartyRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  READONLY = 'readonly',
}

export class Party {
  id: string | undefined;
  name: string;
  email: string;
  role: PartyRole;
  enterpriseId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id?: string;
    name: string;
    email: string;
    role: PartyRole;
    enterpriseId: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.role = params.role;
    this.enterpriseId = params.enterpriseId;
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
