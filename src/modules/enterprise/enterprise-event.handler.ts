import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EnterpriseCreatedEvent } from '../../domain/events/enterprise-created.event';
import { EnterpriseUpdatedEvent } from '../../domain/events/enterprise-updated.event';
import { EventBridgeService } from '../../infrastructure/events/event-bridge.service';
import { DynamoDBService } from '../../infrastructure/audit/dynamodb.service';

/**
 * Event handler for enterprise domain events
 * Publishes events to AWS EventBridge for further processing
 */
@Injectable()
@EventsHandler(EnterpriseCreatedEvent)
export class EnterpriseEventHandler implements IEventHandler<EnterpriseCreatedEvent> {
  private readonly logger = new Logger(EnterpriseEventHandler.name);

  constructor(
    private readonly eventBridgeService: EventBridgeService,
    private readonly auditService: DynamoDBService
  ) {
    this.logger.log('Inicializado manejador de eventos de empresa');
  }

  async handle(event: EnterpriseCreatedEvent) {
    try {
      // Log event reception in Spanish
      this.logger.log('📥 Procesando evento de empresa...');
      this.logger.debug('📊 Detalles:', {
        tipo: event.eventType,
        empresa: event.detail.legalBusinessName,
        id: event.detail.id
      });

      // Store event for audit
      await this.auditService.storeEvent(event);
      this.logger.log('💾 Evento guardado en auditoría');

      // Convert event to EventBridge format
      const eventBridgeEvent = event.toEventBridge();
      this.logger.debug('Evento convertido a formato EventBridge:', eventBridgeEvent);
      
      // Publish event to EventBridge
      this.logger.log('Publicando evento en EventBridge...');
      await this.eventBridgeService.publishEvent(eventBridgeEvent);
      this.logger.log('📤 Evento publicado en EventBridge');

      // Final success message in Spanish
      this.logger.log(`✅ Evento ${event.eventType} procesado exitosamente`);
      
    } catch (error) {
      // Error messages in Spanish
      this.logger.error('❌ Error al procesar evento:', {
        tipo: event.eventType,
        error: error.message
      });
      
      throw new Error(`Error al procesar evento de empresa: ${error.message}`);
    }
  }
}
