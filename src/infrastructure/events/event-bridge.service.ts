import { Injectable, Logger } from '@nestjs/common';
import { EventBridge } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

/**
 * Service for publishing domain events to AWS EventBridge
 */
@Injectable()
export class EventBridgeService {
  private readonly eventBridge: EventBridge;
  private readonly eventBusName: string;
  private readonly logger = new Logger(EventBridgeService.name);

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get('aws');
    this.eventBusName = awsConfig?.eventBusName || 'sistema-bancario-events';

    this.logger.log(`🔧 Configurando EventBridge en la región ${awsConfig?.region}`);
    this.logger.log(`📦 Bus de eventos configurado: ${this.eventBusName}`);
    
    try {
      this.eventBridge = new EventBridge({
        region: awsConfig?.region || 'us-east-1',
        credentials: {
          accessKeyId: awsConfig?.accessKeyId,
          secretAccessKey: awsConfig?.secretAccessKey,
          sessionToken: awsConfig?.sessionToken
        }
      });
      this.logger.log('✅ Cliente de EventBridge inicializado correctamente');
      this.logger.debug('Credenciales configuradas:', {
        region: awsConfig?.region,
        accessKeyId: awsConfig?.accessKeyId?.substring(0, 5) + '...',
        sessionToken: !!awsConfig?.sessionToken
      });
    } catch (error) {
      this.logger.error('❌ Error al inicializar el cliente de EventBridge:', error);
      throw error;
    }
  }

  /**
   * Publish a domain event to EventBridge
   * @param event Domain event to publish
   */
  async publishEvent(event: any): Promise<void> {
    this.logger.log(`📤 Preparando publicación de evento: ${event.DetailType}`);
    this.logger.debug('Datos del evento:', event);

    const params = {
      Entries: [
        {
          EventBusName: this.eventBusName,
          Source: event.Source,
          DetailType: event.DetailType,
          Detail: event.Detail,
          Time: new Date()
        }
      ]
    };

    this.logger.debug('Parámetros de EventBridge:', JSON.stringify(params, null, 2));

    try {
      this.logger.log('⏳ Enviando evento a EventBridge...');
      const result = await this.eventBridge.putEvents(params).promise();
      
      if (result.FailedEntryCount > 0) {
        this.logger.error('❌ Error al publicar eventos:', result.Entries);
        this.logger.error('Detalles de los eventos fallidos:', {
          total: result.FailedEntryCount,
          errores: result.Entries.map(e => ({
            errorCode: e.ErrorCode,
            errorMessage: e.ErrorMessage
          }))
        });
        throw new Error('Error al publicar eventos en EventBridge');
      }

      this.logger.log(`✅ Evento ${event.DetailType} publicado exitosamente`);
      this.logger.debug('Respuesta de EventBridge:', {
        eventId: result.Entries[0]?.EventId,
        failedCount: result.FailedEntryCount
      });
    } catch (error) {
      this.logger.error(`❌ Error al publicar evento ${event.DetailType}:`, error);
      this.logger.error('Detalles del evento con error:', {
        bus: this.eventBusName,
        tipo: event.DetailType,
        datos: event.Detail
      });
      throw error;
    }
  }
}
