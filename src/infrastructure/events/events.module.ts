import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventBridgeService } from './event-bridge.service';
import { Logger } from '@nestjs/common';

/**
 * Events Module
 * Provides event publishing capabilities using AWS EventBridge
 */
@Module({
  imports: [
    ConfigModule,
    CqrsModule,
  ],
  providers: [
    EventBridgeService,
  ],
  exports: [
    EventBridgeService,
  ],
})
export class EventsModule {
  constructor() {
    const logger = new Logger(EventsModule.name);
    logger.log('🔧 Módulo de eventos inicializado');
  }
}
