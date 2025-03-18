import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEnterpriseCommand } from '../../../application/commands/enterprise/create-enterprise.command';
import { GetEnterpriseQuery } from '../../../application/queries/enterprise/get-enterprise.query';
import { EnterpriseType } from '../../../domain/enums/enterprise-type.enum';

/**
 * Enterprise Controller
 * Handles HTTP requests for enterprise domain
 */
@Controller('enterprises')
export class EnterpriseController {
  private readonly logger = new Logger(EnterpriseController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    this.logger.log('🏢 Controlador de empresa inicializado');
  }

  /**
   * Create a new enterprise
   */
  @Post()
  async createEnterprise(@Body() data: {
    taxId: string;
    legalBusinessName: string;
    enterpriseType: EnterpriseType;
    contactEmail: string;
    contactPhone: string;
  }) {
    this.logger.log('📝 Creando nueva empresa...');
    this.logger.debug('Datos recibidos:', data);

    const command = CreateEnterpriseCommand.fromRequest(data);
    const result = await this.commandBus.execute(command);

    this.logger.log('✅ Empresa creada exitosamente');
    return result;
  }

  /**
   * Get enterprise by ID
   */
  @Get(':id')
  async getEnterprise(@Param('id') id: string) {
    this.logger.log(`🔍 Buscando empresa con ID: ${id}`);
    
    const query = new GetEnterpriseQuery(id);
    const result = await this.queryBus.execute(query);

    if (result) {
      this.logger.log('✅ Empresa encontrada');
    } else {
      this.logger.warn('❌ Empresa no encontrada');
    }

    return result;
  }
}
