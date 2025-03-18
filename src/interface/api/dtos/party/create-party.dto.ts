import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PartyRole } from '../../../../domain/enums/party-role.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new party
 */
export class CreatePartyDto {
  @ApiProperty({
    description: 'Name of the party',
    example: 'John Doe'
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  readonly name: string;

  @ApiProperty({
    description: 'Email address of the party',
    example: 'john.doe@example.com'
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El formato del email es inválido' })
  readonly email: string;

  @ApiProperty({
    description: 'Role of the party in the enterprise',
    enum: PartyRole,
    example: PartyRole.EMPLOYEE
  })
  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsEnum(PartyRole, { message: 'Rol inválido' })
  readonly role: PartyRole;

  @ApiProperty({
    description: 'UUID of the enterprise this party belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty({ message: 'El ID de la empresa es requerido' })
  @IsUUID('4', { message: 'El ID de la empresa debe ser un UUID válido' })
  readonly enterpriseId: string;
}
