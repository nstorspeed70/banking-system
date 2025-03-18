/**
 * Event processor Lambda function
 * Processes domain events from EventBridge and stores them in DynamoDB for auditing
 */
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * Main handler for processing domain events
 * @param {Object} event - EventBridge event
 */
exports.handler = async (event) => {
    console.log('Processing event:', JSON.stringify(event, null, 2));

    try {
        // Extract event details
        const eventTime = new Date().toISOString();
        const eventId = event.id || event['detail-type'];
        const eventType = event['detail-type'];
        const eventDetail = event.detail;

        // Prepare audit record
        const auditRecord = {
            TableName: process.env.DYNAMODB_TABLE || 'sistema-bancario-auditoria',
            Item: {
                id: `${eventType}_${eventTime}`,
                timestamp: eventTime,
                eventType: eventType,
                aggregateId: eventDetail.aggregateId,
                data: eventDetail,
                source: event.source || 'sistema-bancario.enterprises'
            }
        };

        console.log('Storing audit record:', JSON.stringify(auditRecord, null, 2));

        // Store in DynamoDB for audit
        await dynamoDB.put(auditRecord).promise();
        console.log('Event stored successfully:', eventId);

        // Process specific event types
        switch (eventType) {
            case 'EnterpriseCreated':
                await handleEnterpriseCreated(eventDetail);
                break;
            case 'EnterpriseUpdated':
                await handleEnterpriseUpdated(eventDetail);
                break;
            default:
                console.log('Unhandled event type:', eventType);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event processed successfully',
                eventId: eventId
            })
        };
    } catch (error) {
        console.error('Error processing event:', error);
        throw error;
    }
};

/**
 * Handle EnterpriseCreated event
 * @param {Object} detail - Event details
 */
async function handleEnterpriseCreated(detail) {
    console.log('Processing EnterpriseCreated:', detail);
    // Aquí podríamos desencadenar flujos de trabajo adicionales
    // Por ejemplo: Enviar email de bienvenida, crear recursos por defecto, etc.
}

/**
 * Handle EnterpriseUpdated event
 * @param {Object} detail - Event details
 */
async function handleEnterpriseUpdated(detail) {
    console.log('Processing EnterpriseUpdated:', detail);
    // Aquí podríamos desencadenar flujos de trabajo de actualización
    // Por ejemplo: Actualizar recursos relacionados, enviar notificaciones, etc.
}
