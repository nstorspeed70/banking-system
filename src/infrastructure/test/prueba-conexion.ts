import { DataSource } from 'typeorm';
import { awsConfig } from '../config/aws.config';
import { DynamoDB } from 'aws-sdk';

/**
 * Connection test utility
 * Tests connections to AWS services
 */
async function probarConexion() {
  console.log('🚀 Iniciando prueba de conexión a servicios AWS...');

  try {
    // 1. Probar PostgreSQL
    console.log('\n📊 Conectando a PostgreSQL...');
    const dataSource = new DataSource({
      type: 'postgres',
      host: awsConfig.database.host,
      port: awsConfig.database.port,
      username: awsConfig.database.username,
      password: process.env.DB_PASSWORD,
      database: awsConfig.database.database,
      synchronize: false,
      logging: true
    });

    await dataSource.initialize();
    console.log('✅ Conexión a PostgreSQL exitosa');

    // Crear una tabla de prueba
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS prueba_conexion (
        id SERIAL PRIMARY KEY,
        mensaje VARCHAR(255),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar un registro de prueba
    await dataSource.query(`
      INSERT INTO prueba_conexion (mensaje) 
      VALUES ('Prueba de conexión exitosa')
    `);

    // Leer el registro
    const resultado = await dataSource.query('SELECT * FROM prueba_conexion');
    console.log('📝 Datos de prueba:', resultado);

    // 2. Probar DynamoDB
    console.log('\n📦 Conectando a DynamoDB...');
    const dynamoDB = new DynamoDB({
      region: awsConfig.dynamodb.region
    });

    const tablas = await dynamoDB.listTables().promise();
    console.log('✅ Conexión a DynamoDB exitosa');
    console.log('📋 Tablas disponibles:', tablas.TableNames);

    // Cerrar conexión a PostgreSQL
    await dataSource.destroy();
    console.log('\n🎉 Todas las pruebas completadas con éxito!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
probarConexion();
