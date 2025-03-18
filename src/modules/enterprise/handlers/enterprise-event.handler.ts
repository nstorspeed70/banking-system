import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EnterpriseCreatedEvent } from '../../../domain/events/enterprise-created.event';
import { EnterpriseUpdatedEvent } from '../../../domain/events/enterprise-updated.event';
import { EventBridgeService } from '../../../infrastructure/events/event-bridge.service';

/**
 * Manejador de eventos del dominio de empresas
 * Publica eventos en AWS EventBridge para su posterior procesamiento
 */
@Injectable()
@EventsHandler(EnterpriseCreatedEvent, EnterpriseUpdatedEvent)
export class EnterpriseEventHandler implements IEventHandler<EnterpriseCreatedEvent | EnterpriseUpdatedEvent> {
  private readonly logger = new Logger(EnterpriseEventHandler.name);

  constructor(private readonly eventBridgeService: EventBridgeService) {
    this.logger.log('Manejador de eventos de empresa inicializado');
  }

  async handle(event: EnterpriseCreatedEvent | EnterpriseUpdatedEvent) {
    try {
      this.logger.log(`Procesando evento de dominio: ${event.eventType}`);
      
      // Log datos del evento según su tipo
      if (event instanceof EnterpriseCreatedEvent) {
        this.logger.debug('Datos del evento de creación:', {
          tipo: event.eventType,
          datos: event.detail,
          timestamp: new Date().toISOString()
        });
      } else {
        this.logger.debug('Datos del evento de actualización:', {
          tipo: event.eventType,
          datos: event.data,
          timestamp: event.timestamp.toISOString()
        });
      }

      // Convertir evento al formato de EventBridge
      const eventBridgeEvent = event.toEventBridge();

      this.logger.debug('Evento convertido a formato EventBridge:', eventBridgeEvent);
      
      // Publicar evento en EventBridge
      this.logger.log('Publicando evento en EventBridge...');
      await this.eventBridgeService.publishEvent(eventBridgeEvent);
      
      this.logger.log(`Evento ${event.eventType} procesado y publicado exitosamente`);
      
      // Log detalles según tipo de evento
      if (event instanceof EnterpriseCreatedEvent) {
        this.logger.debug('Detalles del evento de creación publicado:', {
          tipo: event.eventType,
          id: event.detail.id,
          empresa: event.detail.legalBusinessName,
          ruc: event.detail.taxId,
          timestamp: new Date().toISOString()
        });
      } else {
        this.logger.debug('Detalles del evento de actualización publicado:', {
          tipo: event.eventType,
          id: event.data.aggregateId,
          empresa: event.data.legalBusinessName,
          ruc: event.data.taxId,
          timestamp: event.timestamp.toISOString()
        });
      }
    } catch (error) {
      this.logger.error(`Error al procesar evento ${event.eventType}:`, error);
      // Log error según tipo de evento
      if (event instanceof EnterpriseCreatedEvent) {
        this.logger.error('Detalles del evento de creación con error:', {
          tipo: event.eventType,
          datos: event.detail,
          timestamp: new Date().toISOString()
        });
      } else {
        this.logger.error('Detalles del evento de actualización con error:', {
          tipo: event.eventType,
          datos: event.data,
          timestamp: event.timestamp.toISOString()
        });
      }
      throw error;
    }
  }
}
