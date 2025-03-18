import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { PartyRole } from '../../../../domain/enums/party-role.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la actualización de un miembro existente
 */
export class UpdatePartyDto {
  @ApiProperty({
    description: 'Name of the party',
    example: 'John Doe',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  readonly name?: string;

  @ApiProperty({
    description: 'Email address of the party',
    example: 'john.doe@example.com',
    required: false
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del email es inválido' })
  readonly email?: string;

  @ApiProperty({
    description: 'Role of the party in the enterprise',
    enum: PartyRole,
    example: PartyRole.EMPLOYEE,
    required: false
  })
  @IsOptional()
  @IsEnum(PartyRole, { message: 'Rol inválido' })
  readonly role?: PartyRole;
}
