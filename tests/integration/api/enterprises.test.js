const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const API_URL = process.env.API_URL;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const TEST_USER = process.env.TEST_USER;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

let authToken;
let createdEnterpriseId;

describe('Enterprise API Integration Tests', () => {
    beforeAll(async () => {
        try {
            const cognito = new AWS.CognitoIdentityServiceProvider();
            const authResult = await cognito.initiateAuth({
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: COGNITO_CLIENT_ID,
                AuthParameters: {
                    USERNAME: TEST_USER,
                    PASSWORD: TEST_PASSWORD
                }
            }).promise();
            
            authToken = authResult.AuthenticationResult.IdToken;
        } catch (error) {
            console.error('Error obteniendo token:', error);
            throw error;
        }
    });

    describe('POST /enterprises', () => {
        it('should create a new enterprise', async () => {
            const testEnterprise = {
                taxId: "20" + Math.floor(Math.random() * 999999999),
                legalBusinessName: "Test Enterprise SA",
                enterpriseType: "SAC",
                contactEmail: `test.${uuidv4()}@example.com`,
                contactPhone: "+51999888777"
            };

            const response = await axios.post(`${API_URL}/enterprises`, testEnterprise, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            expect(response.status).toBe(201);
            expect(response.data.message).toBe('Enterprise created successfully');
            expect(response.data.data).toHaveProperty('id');
            expect(response.data.data.taxId).toBe(testEnterprise.taxId);

            createdEnterpriseId = response.data.data.id;
        });

        it('should validate tax_id format', async () => {
            const invalidEnterprise = {
                taxId: "123", 
                legalBusinessName: "Test Enterprise SA",
                enterpriseType: "SAC",
                contactEmail: "test@example.com",
                contactPhone: "+51999888777"
            };

            try {
                await axios.post(`${API_URL}/enterprises`, invalidEnterprise, {
                    headers: { 
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                fail('Should have thrown validation error');
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data.message).toContain('taxId');
            }
        });
    });

    describe('GET /enterprises', () => {
        it('should list enterprises with pagination', async () => {
            const response = await axios.get(`${API_URL}/enterprises?page=1&limit=10`, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Enterprises retrieved successfully');
            expect(response.data.data).toBeInstanceOf(Array);
            expect(response.data).toHaveProperty('pagination');
            expect(response.data.pagination).toHaveProperty('total');
            expect(response.data.pagination).toHaveProperty('page');
            expect(response.data.pagination).toHaveProperty('limit');
        });

        it('should filter enterprises by type', async () => {
            const response = await axios.get(`${API_URL}/enterprises?type=SAC`, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Enterprises retrieved successfully');
            expect(response.data.data).toBeInstanceOf(Array);
            response.data.data.forEach(enterprise => {
                expect(enterprise.enterpriseType).toBe('SAC');
            });
        });
    });

    describe('GET /enterprises/{id}', () => {
        it('should get enterprise details', async () => {
            const response = await axios.get(`${API_URL}/enterprises/${createdEnterpriseId}`, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Enterprise retrieved successfully');
            expect(response.data.data.id).toBe(createdEnterpriseId);
        });

        it('should return 404 for non-existent enterprise', async () => {
            try {
                await axios.get(`${API_URL}/enterprises/999999`, {
                    headers: { 
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                fail('Should have thrown not found error');
            } catch (error) {
                expect(error.response.status).toBe(404);
            }
        });
    });

    describe('PUT /enterprises/{id}', () => {
        it('should update enterprise information', async () => {
            const updates = {
                legalBusinessName: "Updated Test Enterprise SA",
                contactEmail: `updated.${uuidv4()}@example.com`
            };

            const response = await axios.put(
                `${API_URL}/enterprises/${createdEnterpriseId}`,
                updates,
                { 
                    headers: { 
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Enterprise updated successfully');
            expect(response.data.data.legalBusinessName).toBe(updates.legalBusinessName);
            expect(response.data.data.contactEmail).toBe(updates.contactEmail);
        });
    });

    describe('DELETE /enterprises/{id}', () => {
        it('should soft delete enterprise', async () => {
            const response = await axios.delete(
                `${API_URL}/enterprises/${createdEnterpriseId}`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Enterprise deleted successfully');

            const getResponse = await axios.get(
                `${API_URL}/enterprises/${createdEnterpriseId}`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            expect(getResponse.data.data.isActive).toBe(false);
        });
    });
});
