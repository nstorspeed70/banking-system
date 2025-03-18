export enum UserRole {
  ADMIN = 'admin',
  REGULAR = 'regular',
  READONLY = 'readonly',
}

export class User {
  id: string | undefined;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id?: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.username = params.username;
    this.email = params.email;
    this.password = params.password;
    this.role = params.role;
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
