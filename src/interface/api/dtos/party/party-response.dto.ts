import { PartyRole } from '../../../../domain/enums/party-role.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for party response data
 */
export class PartyResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the party',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  readonly id: string;

  @ApiProperty({
    description: 'Name of the party',
    example: 'John Doe'
  })
  readonly name: string;

  @ApiProperty({
    description: 'Email address of the party',
    example: 'john.doe@example.com'
  })
  readonly email: string;

  @ApiProperty({
    description: 'Role of the party in the enterprise',
    enum: PartyRole,
    example: PartyRole.EMPLOYEE
  })
  readonly role: PartyRole;

  @ApiProperty({
    description: 'UUID of the enterprise this party belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  readonly enterpriseId: string;

  @ApiProperty({
    description: 'Indicates if the party is active',
    example: true
  })
  readonly isActive: boolean;

  @ApiProperty({
    description: 'Timestamp when the party was created',
    example: '2025-03-16T14:39:32Z'
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the party was last updated',
    example: '2025-03-16T14:39:32Z'
  })
  readonly updatedAt: Date;

  constructor(partial: Partial<PartyResponseDto>) {
    Object.assign(this, partial);
  }
}
