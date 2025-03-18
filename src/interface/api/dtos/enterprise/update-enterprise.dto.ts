import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, Length, Matches, IsOptional } from 'class-validator';
import { EnterpriseType } from '../../../../domain/enums/enterprise-type.enum';

/**
 * Data Transfer Object for updating an enterprise
 */
export class UpdateEnterpriseDto {
  @ApiPropertyOptional({
    description: 'Legal business name',
    example: 'Empresa Ejemplo SRL'
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  readonly legalBusinessName?: string;

  @ApiPropertyOptional({
    description: 'Tax identification number',
    example: 'PE12345678901'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{9,15}$/, {
    message: 'Tax ID must be between 9 and 15 alphanumeric characters'
  })
  readonly taxId?: string;

  @ApiPropertyOptional({
    description: 'Type of enterprise',
    enum: EnterpriseType,
    example: EnterpriseType.SRL
  })
  @IsOptional()
  @IsEnum(EnterpriseType)
  readonly enterpriseType?: EnterpriseType;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'contacto@empresa.com'
  })
  @IsOptional()
  @IsEmail()
  readonly contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+51999888777'
  })
  @IsOptional()
  @IsString()
  @Length(8, 15)
  readonly contactPhone?: string;
}
