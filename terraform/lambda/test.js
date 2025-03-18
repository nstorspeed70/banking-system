// Mock del módulo pg antes de importar enterprises.js
const mockPool = {
    query: async (sql, params) => {
        console.log('SQL:', sql);
        console.log('Params:', params);
        
        // Simular datos de la base de datos
        return {
            rows: [{
                id: 4,
                tax_id: "123456789",
                legal_business_name: "Test SA",
                enterprise_type: "CORP",
                contact_email: "test@test.com",
                contact_phone: "123456789",
                is_active: true,
                created_at: "2025-03-17T15:59:23.666Z",
                updated_at: "2025-03-17T15:59:23.666Z"
            }]
        };
    },
    connect: async () => mockPool,
    release: () => {}
};

// Reemplazar el módulo pg
require.cache[require.resolve('pg')] = {
    exports: {
        Pool: function() {
            return mockPool;
        }
    }
};

// Ahora importamos enterprises.js
const { handler } = require('./enterprises');

// Evento de prueba para GET /enterprises/4
const event = {
    httpMethod: 'GET',
    path: '/dev/enterprises/4',
    pathParameters: {
        id: '4'
    },
    queryStringParameters: null,
    body: null
};

// Ejecutar la prueba
handler(event)
    .then(response => {
        console.log('Respuesta:', JSON.stringify(response, null, 2));
    })
    .catch(error => {
        console.error('Error:', error);
    });
