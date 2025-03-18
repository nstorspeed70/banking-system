import { EnterpriseType } from '../../../domain/enums/enterprise-type.enum';

/**
 * Command for creating a new enterprise
 */
export class CreateEnterpriseCommand {
  constructor(
    public readonly taxId: string,
    public readonly legalBusinessName: string,
    public readonly enterpriseType: EnterpriseType,
    public readonly contactEmail: string,
    public readonly contactPhone: string,
  ) {}

  /**
   * Create command from request data
   */
  static fromRequest(data: {
    taxId: string;
    legalBusinessName: string;
    enterpriseType: EnterpriseType;
    contactEmail: string;
    contactPhone: string;
  }): CreateEnterpriseCommand {
    return new CreateEnterpriseCommand(
      data.taxId,
      data.legalBusinessName,
      data.enterpriseType,
      data.contactEmail,
      data.contactPhone,
    );
  }
}
