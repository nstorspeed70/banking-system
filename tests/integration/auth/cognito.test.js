const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '51ehketrk1om08d39uvfu2hvb8';
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_Kw4xeY074';

const cognito = new AWS.CognitoIdentityServiceProvider();

describe('Cognito Authentication Integration Tests', () => {
    let testUserEmail;
    let testUserPassword;

    beforeAll(() => {
        testUserEmail = `test.${uuidv4()}@example.com`;
        testUserPassword = 'Test123!@#';
    });

    describe('User Management', () => {
        it('should create a new user', async () => {
            const params = {
                UserPoolId: COGNITO_USER_POOL_ID,
                Username: testUserEmail,
                TemporaryPassword: testUserPassword,
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: testUserEmail
                    },
                    {
                        Name: 'email_verified',
                        Value: 'true'
                    }
                ]
            };

            const result = await cognito.adminCreateUser(params).promise();
            expect(result.User).toBeDefined();
            expect(result.User.Username).toBe(testUserEmail);
        });

        it('should set permanent password', async () => {
            // Iniciar sesión con contraseña temporal
            const authResult = await cognito.adminInitiateAuth({
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                ClientId: COGNITO_CLIENT_ID,
                UserPoolId: COGNITO_USER_POOL_ID,
                AuthParameters: {
                    USERNAME: testUserEmail,
                    PASSWORD: testUserPassword
                }
            }).promise();

            expect(authResult.ChallengeName).toBe('NEW_PASSWORD_REQUIRED');

            // Establecer contraseña permanente
            const challengeResult = await cognito.adminRespondToAuthChallenge({
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                ClientId: COGNITO_CLIENT_ID,
                UserPoolId: COGNITO_USER_POOL_ID,
                ChallengeResponses: {
                    USERNAME: testUserEmail,
                    NEW_PASSWORD: testUserPassword
                },
                Session: authResult.Session
            }).promise();

            expect(challengeResult.AuthenticationResult).toBeDefined();
        });

        it('should authenticate user', async () => {
            const result = await cognito.adminInitiateAuth({
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                ClientId: COGNITO_CLIENT_ID,
                UserPoolId: COGNITO_USER_POOL_ID,
                AuthParameters: {
                    USERNAME: testUserEmail,
                    PASSWORD: testUserPassword
                }
            }).promise();

            expect(result.AuthenticationResult).toBeDefined();
            expect(result.AuthenticationResult.AccessToken).toBeDefined();
            expect(result.AuthenticationResult.IdToken).toBeDefined();
            expect(result.AuthenticationResult.RefreshToken).toBeDefined();
        });

        it('should fail with incorrect password', async () => {
            try {
                await cognito.adminInitiateAuth({
                    AuthFlow: 'ADMIN_NO_SRP_AUTH',
                    ClientId: COGNITO_CLIENT_ID,
                    UserPoolId: COGNITO_USER_POOL_ID,
                    AuthParameters: {
                        USERNAME: testUserEmail,
                        PASSWORD: 'WrongPassword123!@'
                    }
                }).promise();
                fail('Should have thrown NotAuthorizedException');
            } catch (error) {
                expect(error.code).toBe('NotAuthorizedException');
            }
        });

        it('should refresh token', async () => {
            // Primero autenticamos para obtener el refresh token
            const authResult = await cognito.adminInitiateAuth({
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                ClientId: COGNITO_CLIENT_ID,
                UserPoolId: COGNITO_USER_POOL_ID,
                AuthParameters: {
                    USERNAME: testUserEmail,
                    PASSWORD: testUserPassword
                }
            }).promise();

            // Usamos el refresh token para obtener nuevos tokens
            const refreshResult = await cognito.initiateAuth({
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId: COGNITO_CLIENT_ID,
                AuthParameters: {
                    REFRESH_TOKEN: authResult.AuthenticationResult.RefreshToken
                }
            }).promise();

            expect(refreshResult.AuthenticationResult).toBeDefined();
            expect(refreshResult.AuthenticationResult.AccessToken).toBeDefined();
        });
    });

    describe('User Attributes', () => {
        it('should get user attributes', async () => {
            const result = await cognito.adminGetUser({
                UserPoolId: COGNITO_USER_POOL_ID,
                Username: testUserEmail
            }).promise();

            expect(result.UserAttributes).toBeDefined();
            const emailAttribute = result.UserAttributes.find(attr => attr.Name === 'email');
            expect(emailAttribute.Value).toBe(testUserEmail);
        });

        it('should update user attributes', async () => {
            const newPhoneNumber = '+51999888777';
            await cognito.adminUpdateUserAttributes({
                UserPoolId: COGNITO_USER_POOL_ID,
                Username: testUserEmail,
                UserAttributes: [
                    {
                        Name: 'phone_number',
                        Value: newPhoneNumber
                    }
                ]
            }).promise();

            const result = await cognito.adminGetUser({
                UserPoolId: COGNITO_USER_POOL_ID,
                Username: testUserEmail
            }).promise();

            const phoneAttribute = result.UserAttributes.find(attr => attr.Name === 'phone_number');
            expect(phoneAttribute.Value).toBe(newPhoneNumber);
        });
    });

    afterAll(async () => {
        // Limpiar usuario de prueba
        try {
            await cognito.adminDeleteUser({
                UserPoolId: COGNITO_USER_POOL_ID,
                Username: testUserEmail
            }).promise();
        } catch (error) {
            console.error('Error cleaning up test user:', error);
        }
    });
});
