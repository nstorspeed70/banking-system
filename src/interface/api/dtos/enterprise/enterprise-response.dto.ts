import { ApiProperty } from '@nestjs/swagger';
import { EnterpriseType } from '../../../../domain/enums/enterprise-type.enum';

/**
 * Enterprise Response Data Transfer Object
 * Used for API responses
 */
export class EnterpriseResponseDto {
  @ApiProperty({
    description: 'Enterprise unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Legal business name',
    example: 'Empresa Ejemplo SRL'
  })
  legalBusinessName: string;

  @ApiProperty({
    description: 'Tax identification number',
    example: 'PE12345678901'
  })
  taxId: string;

  @ApiProperty({
    description: 'Type of enterprise',
    enum: EnterpriseType,
    example: EnterpriseType.SRL
  })
  enterpriseType: EnterpriseType;

  @ApiProperty({
    description: 'Contact email address',
    example: 'contacto@empresa.com'
  })
  contactEmail: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+51999888777'
  })
  contactPhone: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-03-14T00:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-03-14T00:00:00Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Whether the enterprise is active',
    example: true
  })
  isActive: boolean;

  constructor(partial?: Partial<EnterpriseResponseDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
