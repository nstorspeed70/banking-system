import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateEnterpriseUseCase } from '../../../../application/use-cases/enterprise/create-enterprise.use-case';
import { UpdateEnterpriseUseCase } from '../../../../application/use-cases/enterprise/update-enterprise.use-case';
import { DeleteEnterpriseUseCase } from '../../../../application/use-cases/enterprise/delete-enterprise.use-case';
import { ListEnterprisesUseCase } from '../../../../application/use-cases/enterprise/list-enterprises.use-case';
import { GetEnterpriseUseCase } from '../../../../application/use-cases/enterprise/get-enterprise.use-case';
import { CreateEnterpriseDto } from '../../dtos/enterprise/create-enterprise.dto';
import { UpdateEnterpriseDto } from '../../dtos/enterprise/update-enterprise.dto';
import { EnterpriseResponseDto } from '../../dtos/enterprise/enterprise-response.dto';
import { FilterEnterpriseDto } from '../../dtos/enterprise/filter-enterprise.dto';
import { EnterpriseAggregate } from '../../../../domain/aggregates/enterprise/enterprise.aggregate';

/**
 * Controlador para gestionar las operaciones CRUD de empresas
 */
@ApiTags('Enterprises')
@Controller('enterprises')
export class EnterpriseController {
  constructor(
    private readonly createEnterpriseUseCase: CreateEnterpriseUseCase,
    private readonly updateEnterpriseUseCase: UpdateEnterpriseUseCase,
    private readonly deleteEnterpriseUseCase: DeleteEnterpriseUseCase,
    private readonly listEnterprisesUseCase: ListEnterprisesUseCase,
    private readonly getEnterpriseUseCase: GetEnterpriseUseCase,
  ) {}

  /**
   * Obtiene un listado de empresas con filtros y paginación
   */
  @Get()
  @ApiOperation({ summary: 'List enterprises with optional filtering' })
  @ApiResponse({ status: HttpStatus.OK, type: [EnterpriseResponseDto] })
  async findAll(@Query() filterDto: FilterEnterpriseDto): Promise<{ message: string; data: EnterpriseResponseDto[]; pagination: any }> {
    const result = await this.listEnterprisesUseCase.execute({
      enterpriseType: filterDto.enterpriseType,
      page: filterDto.page || 1,
      limit: filterDto.limit || 10,
    });

    return {
      message: 'Enterprises retrieved successfully',
      data: result.items.map(enterprise => this.mapToResponseDto(enterprise)),
      pagination: {
        page: filterDto.page || 1,
        limit: filterDto.limit || 10,
        total: result.total,
        totalPages: Math.ceil(result.total / (filterDto.limit || 10))
      }
    };
  }

  /**
   * Obtiene los detalles de una empresa por su ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get enterprise by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: EnterpriseResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Enterprise not found' })
  @ApiParam({ name: 'id', type: Number, description: 'Enterprise ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<{ message: string; data: EnterpriseResponseDto }> {
    const enterprise = await this.getEnterpriseUseCase.execute(id);
    return {
      message: 'Enterprise retrieved successfully',
      data: this.mapToResponseDto(enterprise)
    };
  }

  /**
   * Crea una nueva empresa
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new enterprise' })
  @ApiResponse({ status: HttpStatus.CREATED, type: EnterpriseResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() createEnterpriseDto: CreateEnterpriseDto): Promise<{ message: string; data: EnterpriseResponseDto }> {
    const enterprise = await this.createEnterpriseUseCase.execute(createEnterpriseDto);
    return {
      message: 'Enterprise created successfully',
      data: this.mapToResponseDto(enterprise)
    };
  }

  /**
   * Actualiza una empresa existente
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an enterprise' })
  @ApiResponse({ status: HttpStatus.OK, type: EnterpriseResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Enterprise not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnterpriseDto: UpdateEnterpriseDto,
  ): Promise<{ message: string; data: EnterpriseResponseDto }> {
    const enterprise = await this.updateEnterpriseUseCase.execute(id, updateEnterpriseDto);
    return {
      message: 'Enterprise updated successfully',
      data: this.mapToResponseDto(enterprise)
    };
  }

  /**
   * Elimina una empresa (borrado lógico)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an enterprise' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Enterprise not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.deleteEnterpriseUseCase.execute(id);
    return {
      message: 'Enterprise deleted successfully'
    };
  }

  /**
   * Mapea una entidad Enterprise a un DTO de respuesta
   */
  private mapToResponseDto(enterprise: EnterpriseAggregate): EnterpriseResponseDto {
    return new EnterpriseResponseDto({
      id: enterprise.id,
      legalBusinessName: enterprise.legalBusinessName,
      taxId: enterprise.taxId.toString(),
      enterpriseType: enterprise.enterpriseType,
      contactEmail: enterprise.contactEmail.toString(),
      contactPhone: enterprise.contactPhone,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
  }
}
