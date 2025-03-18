/**
 * Database connection test script
 * Tests connections to PostgreSQL and DynamoDB
 */

import { createConnection } from 'typeorm';
import { DynamoDB } from 'aws-sdk';
import { awsConfig } from './config/aws.config';

async function testConnections() {
  console.log('Probando conexiones a servicios AWS...');

  try {
    // Test PostgreSQL Connection
    console.log('\n1. Probando conexión a PostgreSQL (RDS)...');
    const connection = await createConnection({
      type: 'postgres',
      host: awsConfig.database.host,
      port: awsConfig.database.port,
      username: awsConfig.database.username,
      password: process.env.DB_PASSWORD,
      database: awsConfig.database.database,
    });

    console.log('✅ Conexión a PostgreSQL exitosa!');
    await connection.close();

    // Test DynamoDB Connection
    console.log('\n2. Probando conexión a DynamoDB...');
    const dynamoDB = new DynamoDB({
      region: awsConfig.dynamodb.region,
    });

    const tables = await dynamoDB.listTables().promise();
    console.log('✅ Conexión a DynamoDB exitosa!');
    console.log('Tablas disponibles:', tables.TableNames);

    console.log('\n✨ Todas las conexiones funcionan correctamente.');
  } catch (error) {
    console.error('❌ Error en las conexiones:', error);
  }
}

// Run the test
testConnections();
