import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { CreateEnterpriseUseCase } from '../src/application/use-cases/enterprise/create-enterprise.use-case';
import { EnterpriseType } from '../src/domain/enums/enterprise-type.enum';
import { config } from 'dotenv';
import * as AWS from 'aws-sdk';

async function probarEvento() {
  // Cargar variables de entorno
  config();

  // Configurar logger principal
  const logger = new Logger('Prueba de Eventos');
  logger.log('🚀 Iniciando prueba del sistema bancario...');

  let app;

  try {
    // Verificar configuración de AWS
    logger.log('\n🔑 Verificando configuración de AWS...');
    
    // Configurar AWS SDK
    AWS.config.update({ region: 'us-east-1' });

    // Verificar credenciales
    const sts = new AWS.STS();
    const identity = await sts.getCallerIdentity().promise();
    logger.log('✅ Credenciales verificadas');
    logger.log('👤 Usuario:', identity.Arn);
    logger.log('🔑 Account:', identity.Account);

    // Inicializar la aplicación NestJS con logs detallados
    logger.log('\n📦 Inicializando módulos de la aplicación...');
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    logger.log('✅ Módulos inicializados correctamente');
    const createEnterpriseUseCase = app.get(CreateEnterpriseUseCase);
    logger.log('✅ Caso de uso de creación obtenido');

    // Preparar los datos de prueba
    const taxId = 'PE12345678901';
    const legalName = 'Empresa de Prueba SRL';
    const enterpriseType = EnterpriseType.SRL;
    const email = 'contacto@empresaprueba.com';
    const phone = '+51999888777';

    logger.log('\n📝 Datos de la nueva empresa:');
    logger.log('- Razón Social:', legalName);
    logger.log('- RUC/NIT:', taxId);
    logger.log('- Tipo de Empresa:', enterpriseType);
    logger.log('- Correo de Contacto:', email);
    logger.log('- Teléfono:', phone);

    // Crear empresa usando el caso de uso
    logger.log('\n⚙️ Ejecutando caso de uso de creación de empresa...');
    const empresa = await createEnterpriseUseCase.execute({
      taxId,
      legalBusinessName: legalName,
      enterpriseType,
      contactEmail: email,
      contactPhone: phone,
    });
    
    logger.log('\n✅ Empresa creada exitosamente:');
    logger.debug('Datos completos de la empresa:', empresa);
    logger.log({
      id: empresa.id,
      razonSocial: empresa.legalBusinessName,
      ruc: empresa.taxId.toString(),
      tipo: empresa.enterpriseType,
      correo: empresa.contactEmail.toString(),
      telefono: empresa.contactPhone,
    });

    logger.log('\n🔍 Verificando eventos en DynamoDB...');
    logger.log('⏳ Espera 5 segundos mientras el evento se procesa...');
    
    // Esperar a que el evento se procese
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verificar el registro en DynamoDB
    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: 'sistema-bancario-auditoria',
      IndexName: 'eventType-index',
      KeyConditionExpression: 'eventType = :eventType',
      ExpressionAttributeValues: {
        ':eventType': 'EnterpriseCreated'
      },
      Limit: 1,
      ScanIndexForward: false // obtener el más reciente primero
    };

    logger.log('\n📊 Consultando tabla de auditoría:', params.TableName);
    logger.debug('Parámetros de consulta:', params);

    const auditoria = await dynamoDB.query(params).promise();
    
    if (auditoria.Items && auditoria.Items.length > 0) {
      logger.log('\n📋 Evento encontrado en auditoría:');
      logger.log(JSON.stringify(auditoria.Items[0], null, 2));
      logger.log('\n✨ Prueba completada exitosamente');
    } else {
      logger.warn('\n❌ No se encontró el evento en la tabla de auditoría');
      logger.warn('Verifica los siguientes puntos:');
      logger.warn('1. Los permisos de la función Lambda están correctos');
      logger.warn('2. El evento se está publicando en EventBridge');
      logger.warn('3. La función Lambda está procesando el evento');
      logger.warn('4. La tabla DynamoDB tiene el índice correcto');

      // Verificar logs de Lambda
      const cloudwatchlogs = new AWS.CloudWatchLogs();
      const logGroupName = '/aws/lambda/sistema-bancario-event-processor';
      
      logger.log('\n📋 Verificando logs de la función Lambda...');
      
      try {
        // Obtener el último stream de logs
        const streams = await cloudwatchlogs.describeLogStreams({
          logGroupName,
          orderBy: 'LastEventTime',
          descending: true,
          limit: 1
        }).promise();

        if (streams.logStreams && streams.logStreams.length > 0) {
          const stream = streams.logStreams[0];
          
          if (stream.logStreamName) {
            // Obtener los eventos del stream
            const events = await cloudwatchlogs.getLogEvents({
              logGroupName,
              logStreamName: stream.logStreamName,
              startFromHead: false,
              limit: 10
            }).promise();

            logger.log('\n📜 Últimos logs de la función Lambda:');
            events.events?.forEach(event => {
              logger.log(event.message);
            });
          }
        }
      } catch (error) {
        logger.error('Error al obtener logs de Lambda:', error.message);
      }
    }

  } catch (error) {
    logger.error('\n❌ Error durante la prueba:', error.message);
    if (error.stack) {
      logger.error('\nDetalles del error:', error.stack);
    }
    logger.error('\nVerifica la configuración y los permisos de AWS');
  } finally {
    if (app) {
      await app.close();
    }
    logger.log('\n✨ Prueba finalizada');
  }
}

// Ejecutar la prueba
probarEvento();
