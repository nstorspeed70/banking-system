const AWS = require('aws-sdk');
require('dotenv').config({ path: '.env.test' });

// Configurar variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'sistema_bancario_test';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'DbMaster2025#Secure';

// AWS
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = 'AKIAWSNB';
process.env.AWS_SECRET_ACCESS_KEY = 'FwrT';

// Cognito
process.env.COGNITO_USER_POOL_ID = 'us-east-1_Kw4xeY074';
process.env.COGNITO_CLIENT_ID = '51ehketrk1om08d39uvfu2hvb8';
process.env.TEST_USER = 'test@example.com';
process.env.TEST_PASSWORD = 'Test123!@';
process.env.API_URL = 'https://jfsrz31u0c.execute-api.us-east-1.amazonaws.com/dev';

// Configurar timeout global para pruebas (5 minutos)
jest.setTimeout(300000);

// Configurar AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    maxRetries: 3
});

// Configurar pool de conexiones
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false
});

// Función helper para limpiar base de datos
global.cleanDatabase = async () => {
    const client = await pool.connect();
    try {
        // Desactivar restricciones de clave foránea temporalmente
        await client.query('SET CONSTRAINTS ALL DEFERRED');
        
        // Limpiar tablas
        await client.query('DELETE FROM enterprise_parties');
        await client.query('DELETE FROM parties');
        await client.query('DELETE FROM enterprises');
        
        // Reactivar restricciones
        await client.query('SET CONSTRAINTS ALL IMMEDIATE');
    } finally {
        await client.release();
    }
};

// Función helper para crear token de prueba
global.getTestToken = async () => {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const authResult = await cognito.initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: process.env.TEST_USER,
            PASSWORD: process.env.TEST_PASSWORD
        }
    }).promise();
    return authResult.AuthenticationResult.AccessToken;
};

// Configurar Jest
beforeAll(async () => {
  try {
    await global.cleanDatabase();
  } catch (error) {
    console.error('Error en la configuración de pruebas:', error);
    throw error;
  }
});

// Limpiar después de todas las pruebas
afterAll(async () => {
  try {
    await global.cleanDatabase();
    await pool.end();
  } catch (error) {
    console.error('Error en la limpieza final:', error);
    throw error;
  }
});

// Función helper para verificar conexión a la base de datos
global.checkDatabaseConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        await client.query('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    } finally {
        if (client) {
            await client.release();
        }
    }
};

// Exportar pool para uso en tests
module.exports = {
    pool
};
