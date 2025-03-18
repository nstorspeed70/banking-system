import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EnterpriseType } from '../../../../domain/enums/enterprise-type.enum';

/**
 * Data Transfer Object for filtering enterprises
 */
export class FilterEnterpriseDto {
  @ApiPropertyOptional({
    description: 'Type of enterprise to filter by',
    enum: EnterpriseType,
    example: EnterpriseType.SRL
  })
  @IsOptional()
  @IsEnum(EnterpriseType)
  readonly enterpriseType?: EnterpriseType;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
    example: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit?: number = 10;
}
