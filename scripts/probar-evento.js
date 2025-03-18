"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const cqrs_1 = require("@nestjs/cqrs");
const app_module_1 = require("../src/app.module");
const create_enterprise_command_1 = require("../src/application/commands/enterprise/create-enterprise.command");
async function probarEvento() {
    console.log('🚀 Iniciando prueba de eventos...');
    try {
        // Crear la aplicación NestJS
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const commandBus = app.get(cqrs_1.CommandBus);
        // Crear comando para nueva empresa
        const comando = new create_enterprise_command_1.CreateEnterpriseCommand({
            legalBusinessName: 'Empresa de Prueba SRL',
            taxId: 'PE12345678901',
            enterpriseType: 'SRL',
            contactEmail: 'contacto@empresaprueba.com',
            contactPhone: '+51999888777'
        });
        console.log('\n📝 Creando empresa...');
        const resultado = await commandBus.execute(comando);
        console.log('\n✅ Empresa creada exitosamente:');
        console.log(JSON.stringify(resultado, null, 2));
        console.log('\n🔍 Verificando eventos...');
        console.log('Espera unos segundos mientras el evento se procesa...');
        // Esperar un momento para que el evento se procese
        await new Promise(resolve => setTimeout(resolve, 5000));
        // Verificar el registro en DynamoDB
        const AWS = require('aws-sdk');
        const dynamoDB = new AWS.DynamoDB.DocumentClient({
            region: 'us-east-1'
        });
        const params = {
            TableName: 'sistema-bancario-auditoria',
            KeyConditionExpression: 'eventType = :eventType',
            ExpressionAttributeValues: {
                ':eventType': 'EnterpriseCreated'
            },
            Limit: 1,
            ScanIndexForward: false // obtener el más reciente primero
        };
        const auditoria = await dynamoDB.query(params).promise();
        if (auditoria.Items && auditoria.Items.length > 0) {
            console.log('\n📋 Evento registrado en auditoría:');
            console.log(JSON.stringify(auditoria.Items[0], null, 2));
        }
        else {
            console.log('\n❌ No se encontró el evento en auditoría');
        }
        await app.close();
        console.log('\n✨ Prueba completada');
    }
    catch (error) {
        console.error('\n❌ Error durante la prueba:', error);
    }
}
// Ejecutar la prueba
probarEvento();
