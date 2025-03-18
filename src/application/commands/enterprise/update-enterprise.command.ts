import { EnterpriseType } from '../../../domain/enums/enterprise-type.enum';

/**
 * Comando para actualizar una empresa existente
 */
export class UpdateEnterpriseCommand {
  constructor(
    public readonly id: string,
    public readonly legalBusinessName?: string,
    public readonly taxId?: string,
    public readonly enterpriseType?: EnterpriseType,
    public readonly contactEmail?: string,
    public readonly contactPhone?: string,
  ) {}
}
