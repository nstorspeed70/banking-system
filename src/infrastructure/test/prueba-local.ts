import { DataSource } from 'typeorm';
import { DynamoDB } from 'aws-sdk';

/**
 * Local connection test
 * Tests AWS infrastructure connectivity from local environment
 */
async function probarConexionLocal() {
  console.log(' Iniciando prueba de conexión local a AWS...');

  try {
    // PostgreSQL Test
    const conexionDB = new DataSource({
      type: 'postgres',
      host: 'sistema-bancario-db.c6daoieako9t.us-east-1.rds.amazonaws.com',
      port: 5432,
      username: 'dbmaster',
      password: process.env.DB_PASSWORD,
      database: 'sistema_bancario',
      synchronize: false,
      logging: true,
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    });

    console.log('\n Conectando a PostgreSQL...');
    await conexionDB.initialize();
    
    // Crear tabla de ejemplo
    console.log('Creando tabla de prueba...');
    await conexionDB.query(`
      CREATE TABLE IF NOT EXISTS empresa_test (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insertar datos de prueba
    console.log('Insertando datos de prueba...');
    const resultado = await conexionDB.query(`
      INSERT INTO empresa_test (nombre) 
      VALUES ('Empresa de Prueba Local') 
      RETURNING *;
    `);

    console.log(' Datos insertados en PostgreSQL:', resultado);

    // Leer datos
    console.log('\nLeyendo datos insertados...');
    const datos = await conexionDB.query('SELECT * FROM empresa_test');
    console.log(' Datos en la tabla:', datos);

    // DynamoDB Test
    console.log('\n Conectando a DynamoDB...');
    const dynamoDB = new DynamoDB({
      region: 'us-east-1'
    });

    const item = {
      TableName: 'sistema-bancario-auditoria',
      Item: {
        'id': { S: 'test-' + Date.now() },
        'fecha': { S: new Date().toISOString() },
        'tipo': { S: 'PRUEBA_LOCAL' },
        'mensaje': { S: 'Conexión local exitosa' }
      }
    };

    await dynamoDB.putItem(item).promise();
    console.log(' Dato insertado en DynamoDB');

    // Limpiar
    console.log('\n Limpiando datos de prueba...');
    await conexionDB.query('DROP TABLE IF EXISTS empresa_test;');
    await conexionDB.destroy();

    console.log('\n Prueba completada con éxito!');
    console.log('- PostgreSQL:  Conectado y funcionando');
    console.log('- DynamoDB:  Conectado y funcionando');

  } catch (error) {
    console.error('\n Error durante la prueba:', error);
    console.log('\n Verifica:');
    console.log('1. Que las credenciales AWS estén configuradas');
    console.log('2. Que la variable DB_PASSWORD esté configurada');
    console.log('3. Que estés conectado a internet');
    console.log('4. Que los security groups permitan tu IP');
  }
}

// Ejecutar la prueba
probarConexionLocal();
