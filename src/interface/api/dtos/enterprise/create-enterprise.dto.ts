import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, Length, Matches } from 'class-validator';
import { EnterpriseType } from '../../../../domain/enums/enterprise-type.enum';

/**
 * Data Transfer Object for creating a new enterprise
 */
export class CreateEnterpriseDto {
  @ApiProperty({
    description: 'Legal business name',
    example: 'Empresa Ejemplo SRL'
  })
  @IsString()
  @Length(3, 100)
  readonly legalBusinessName: string;

  @ApiProperty({
    description: 'Tax identification number',
    example: 'PE12345678901'
  })
  @IsString()
  @Matches(/^[A-Z0-9]{9,15}$/, {
    message: 'Tax ID must be between 9 and 15 alphanumeric characters'
  })
  readonly taxId: string;

  @ApiProperty({
    description: 'Type of enterprise',
    enum: EnterpriseType,
    example: EnterpriseType.SRL
  })
  @IsEnum(EnterpriseType)
  readonly enterpriseType: EnterpriseType;

  @ApiProperty({
    description: 'Contact email address',
    example: 'contacto@empresa.com'
  })
  @IsEmail()
  readonly contactEmail: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+51999888777'
  })
  @IsString()
  @Length(8, 15)
  readonly contactPhone: string;
}
