import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import axios from 'axios';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

// Configuración
const API_URL = 'https://cvy20g7osc.execute-api.us-east-1.amazonaws.com/dev';
const COGNITO_CLIENT_ID = '2qg67m083md62on495ptt3okqs';
const COGNITO_USER_POOL_ID = 'us-east-1_g5urRrRvg';
const REGION = 'us-east-1';

// Configurar logger
const logger = new Logger('Prueba API');

async function verificarCredenciales() {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
    
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        throw new Error('❌ Credenciales de AWS no encontradas. Ejecuta "source config_aws.sh" primero.');
    }

    logger.log('✅ Credenciales de AWS configuradas');
}

async function probarAPI() {
    // Cargar variables de entorno
    config();

    try {
        logger.log('🚀 Iniciando prueba de la API del Sistema Bancario...\n');

        // Verificar credenciales
        await verificarCredenciales();

        // Crear cliente de Cognito
        const cognito = new CognitoIdentityProviderClient({
            region: REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });

        // Datos del usuario de prueba
        const username = `test.user.${Date.now()}@empresaprueba.com`;
        const password = 'Test123456!';

        // Registrar usuario
        logger.log('📝 Registrando usuario de prueba...');
        logger.log('- Correo:', username);
        
        try {
            const signUpCommand = new SignUpCommand({
                ClientId: COGNITO_CLIENT_ID,
                Username: username,
                Password: password,
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: username
                    }
                ]
            });

            await cognito.send(signUpCommand);
            logger.log('✅ Usuario registrado exitosamente');

            // Confirmar usuario
            logger.log('\n🔄 Confirmando registro del usuario...');
            const confirmCommand = new AdminConfirmSignUpCommand({
                UserPoolId: COGNITO_USER_POOL_ID,
                Username: username
            });

            await cognito.send(confirmCommand);
            logger.log('✅ Usuario confirmado exitosamente');

        } catch (error: any) {
            if (error.name === 'UsernameExistsException') {
                logger.warn('⚠️ El usuario ya existe, continuando con el inicio de sesión...');
            } else {
                logger.error('❌ Error al registrar/confirmar usuario:', error.message);
                throw error;
            }
        }

        // Iniciar sesión
        logger.log('\n🔑 Iniciando sesión...');
        const authCommand = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        });

        const authResponse = await cognito.send(authCommand);
        const token = authResponse.AuthenticationResult?.IdToken;

        if (!token) {
            throw new Error('No se pudo obtener el token de autenticación');
        }

        logger.log('✅ Sesión iniciada correctamente');

        // Configurar cliente HTTP
        const api = axios.create({
            baseURL: API_URL,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        // Crear empresa (Command)
        logger.log('\n📦 Creando empresa de prueba...');
        const empresaData = {
            taxId: 'PE98765432109',
            legalBusinessName: 'Empresa API Test SRL',
            enterpriseType: 'SRL',
            contactEmail: 'contacto@empresatest.com',
            contactPhone: '+51999777666'
        };

        logger.log('Datos de la empresa:', empresaData);
        
        const createResponse = await api.post('/enterprises', empresaData);
        logger.log('✅ Empresa creada exitosamente:', {
            id: createResponse.data.id,
            nombre: createResponse.data.legalBusinessName,
            ruc: createResponse.data.taxId
        });

        // Listar empresas (Query)
        logger.log('\n📋 Consultando lista de empresas...');
        const listResponse = await api.get('/enterprises');
        logger.log(`✅ Se encontraron ${listResponse.data.length} empresas:`);
        listResponse.data.forEach((empresa: any) => {
            logger.log(`- ${empresa.legalBusinessName} (RUC: ${empresa.taxId})`);
        });

        // Obtener empresa específica (Query)
        const enterpriseId = createResponse.data.id;
        logger.log(`\n🔍 Consultando detalles de la empresa ${enterpriseId}...`);
        const getResponse = await api.get(`/enterprises/${enterpriseId}`);
        logger.log('✅ Detalles de la empresa:', {
            id: getResponse.data.id,
            razónSocial: getResponse.data.legalBusinessName,
            ruc: getResponse.data.taxId,
            tipo: getResponse.data.enterpriseType,
            correo: getResponse.data.contactEmail,
            teléfono: getResponse.data.contactPhone
        });

        logger.log('\n✨ Prueba completada exitosamente');

    } catch (error: any) {
        logger.error('\n❌ Error durante la prueba:', error.message);
        
        if (error.response) {
            logger.error('Detalles del error:', {
                código: error.response.status,
                mensaje: error.response.data
            });
        }

        if (error.message.includes('expired')) {
            logger.error('\n💡 Sugerencia: Las credenciales han expirado. Ejecuta "source config_aws.sh" y vuelve a intentar.');
        }

        process.exit(1);
    }
}

// Ejecutar prueba
probarAPI();
