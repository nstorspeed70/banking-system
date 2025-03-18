import { Injectable, Logger } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { DomainEvent } from '../../domain/events/domain-event.interface';

/**
 * DynamoDB Audit Service
 * Handles event persistence for audit purposes using DynamoDB
 */
@Injectable()
export class DynamoDBService {
    private readonly dynamodb: DynamoDB.DocumentClient;
    private readonly logger = new Logger(DynamoDBService.name);
    private readonly tableName: string;

    constructor() {
        this.dynamodb = new DynamoDB.DocumentClient({
            region: process.env.AWS_REGION
        });
        this.tableName = process.env.DYNAMODB_TABLE || 'sistema-bancario-auditoria';
    }

    /**
     * Store a domain event in DynamoDB for audit purposes
     * @param event Domain event to store
     * @throws {Error} If event storage fails
     */
    async storeEvent(event: DomainEvent): Promise<void> {
        this.logger.log('📝 Guardando evento en DynamoDB...');

        try {
            const params = {
                TableName: this.tableName,
                Item: {
                    id: event.id,
                    timestamp: event.timestamp,
                    eventType: event.eventType,
                    detail: event.detail
                }
            };

            await this.dynamodb.put(params).promise();
            this.logger.log('✅ Evento guardado exitosamente');
            
        } catch (error) {
            this.logger.error('❌ Error al guardar evento:', error);
            throw new Error('No se pudo guardar el evento en la tabla de auditoría');
        }
    }

    /**
     * Query events by type from DynamoDB
     * @param eventType Type of events to query
     * @returns Array of matching events
     * @throws {Error} If query fails
     */
    async queryEventsByType(eventType: string): Promise<DomainEvent[]> {
        this.logger.log(`🔍 Consultando eventos de tipo ${eventType}...`);

        try {
            const params = {
                TableName: this.tableName,
                IndexName: 'eventType-index',
                KeyConditionExpression: 'eventType = :type',
                ExpressionAttributeValues: {
                    ':type': eventType
                }
            };

            const result = await this.dynamodb.query(params).promise();
            this.logger.log(`✅ Se encontraron ${result.Items?.length || 0} eventos`);
            
            return result.Items as DomainEvent[];
            
        } catch (error) {
            this.logger.error('❌ Error al consultar eventos:', error);
            throw new Error('No se pudieron consultar los eventos');
        }
    }
}
