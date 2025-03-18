const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

// Manejador para crear empresa
const handleCreateEnterprise = async (data) => {
    const client = await pool.connect();
    try {
        console.log('Iniciando creación de empresa:', data);

        // Validar datos requeridos
        const requiredFields = ['taxId', 'legalBusinessName', 'enterpriseType', 'contactEmail', 'contactPhone'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Campo requerido: ${field}`);
            }
        }

        // Crear tabla si no existe
        await client.query(`
            CREATE TABLE IF NOT EXISTS enterprises (
                id SERIAL PRIMARY KEY,
                tax_id VARCHAR(13) UNIQUE NOT NULL,
                legal_business_name VARCHAR(100) NOT NULL,
                enterprise_type VARCHAR(10) NOT NULL,
                contact_email VARCHAR(100) NOT NULL,
                contact_phone VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insertar empresa
        const result = await client.query(
            `INSERT INTO enterprises (
                tax_id,
                legal_business_name,
                enterprise_type,
                contact_email,
                contact_phone
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                data.taxId,
                data.legalBusinessName,
                data.enterpriseType,
                data.contactEmail,
                data.contactPhone
            ]
        );

        console.log('✅ Empresa creada exitosamente:', result.rows[0]);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Enterprise created successfully',
                data: result.rows[0]
            })
        };
    } catch (error) {
        console.error('❌ Error creando empresa:', error);
        console.error('Stack:', error.stack);
        
        // Manejar errores específicos
        if (error.code === '23505') { // Unique violation
            return {
                statusCode: 409,
                body: JSON.stringify({
                    error: 'Conflict',
                    details: 'Tax ID already exists'
                })
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    } finally {
        client.release();
    }
};

// Manejador para listar empresas
const handleListEnterprises = async () => {
    try {
        console.log('Listando empresas activas');
        
        const result = await pool.query(
            `SELECT * FROM enterprises WHERE is_active = true ORDER BY created_at DESC`
        );

        console.log(`✅ ${result.rows.length} empresas encontradas`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Enterprises retrieved successfully',
                data: result.rows
            })
        };
    } catch (error) {
        console.error('❌ Error listando empresas:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};

// Manejador para obtener empresa por ID
const handleGetEnterprise = async (id) => {
    try {
        console.log('Obteniendo empresa por ID:', id);
        
        const result = await pool.query(
            `SELECT * FROM enterprises WHERE id = $1 AND is_active = true`,
            [id]
        );

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Not found',
                    details: 'Enterprise not found'
                })
            };
        }

        console.log('✅ Empresa encontrada:', result.rows[0]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Enterprise retrieved successfully',
                data: result.rows[0]
            })
        };
    } catch (error) {
        console.error('❌ Error obteniendo empresa:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};

// Manejador para actualizar empresa
const handleUpdateEnterprise = async (id, data) => {
    const client = await pool.connect();
    try {
        console.log('Actualizando empresa:', id, data);

        // Verificar si la empresa existe
        const checkResult = await client.query(
            `SELECT * FROM enterprises WHERE id = $1 AND is_active = true`,
            [id]
        );

        if (checkResult.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Not found',
                    details: 'Enterprise not found'
                })
            };
        }

        // Construir la consulta de actualización dinámicamente
        const updateFields = [];
        const updateValues = [];
        let paramCounter = 1;

        if (data.legalBusinessName) {
            updateFields.push(`legal_business_name = $${paramCounter}`);
            updateValues.push(data.legalBusinessName);
            paramCounter++;
        }
        if (data.contactEmail) {
            updateFields.push(`contact_email = $${paramCounter}`);
            updateValues.push(data.contactEmail);
            paramCounter++;
        }
        if (data.contactPhone) {
            updateFields.push(`contact_phone = $${paramCounter}`);
            updateValues.push(data.contactPhone);
            paramCounter++;
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

        // Si no hay campos para actualizar
        if (updateFields.length === 1) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Bad request',
                    details: 'No fields to update'
                })
            };
        }

        const query = `
            UPDATE enterprises 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCounter} AND is_active = true
            RETURNING *
        `;
        updateValues.push(id);

        const result = await client.query(query, updateValues);

        console.log('✅ Empresa actualizada:', result.rows[0]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Enterprise updated successfully',
                data: result.rows[0]
            })
        };
    } catch (error) {
        console.error('❌ Error actualizando empresa:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    } finally {
        client.release();
    }
};

// Manejador para eliminar empresa
const handleDeleteEnterprise = async (id) => {
    const client = await pool.connect();
    try {
        console.log('Eliminando empresa:', id);

        // Verificar si la empresa existe
        const checkResult = await client.query(
            `SELECT * FROM enterprises WHERE id = $1 AND is_active = true`,
            [id]
        );

        if (checkResult.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Not found',
                    details: 'Enterprise not found'
                })
            };
        }

        // Soft delete
        const result = await client.query(
            `UPDATE enterprises 
             SET is_active = false, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 AND is_active = true
             RETURNING *`,
            [id]
        );

        console.log('✅ Empresa eliminada:', result.rows[0]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Enterprise deleted successfully',
                data: result.rows[0]
            })
        };
    } catch (error) {
        console.error('❌ Error eliminando empresa:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    } finally {
        client.release();
    }
};

// Manejador para crear participante
const handleCreateParty = async (enterpriseId, data) => {
    const client = await pool.connect();
    try {
        console.log('Creando participante para empresa:', enterpriseId, data);

        // Verificar si la empresa existe
        const checkResult = await client.query(
            `SELECT * FROM enterprises WHERE id = $1 AND is_active = true`,
            [enterpriseId]
        );

        if (checkResult.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Not found',
                    details: 'Enterprise not found'
                })
            };
        }

        // Crear tabla si no existe
        await client.query(`
            CREATE TABLE IF NOT EXISTS parties (
                id SERIAL PRIMARY KEY,
                enterprise_id INTEGER REFERENCES enterprises(id),
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                role VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(enterprise_id, email)
            )
        `);

        // Validar datos requeridos
        const requiredFields = ['name', 'email', 'role'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Campo requerido: ${field}`);
            }
        }

        // Validar rol
        const validRoles = ['ADMIN', 'EMPLOYEE'];
        if (!validRoles.includes(data.role)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Bad request',
                    details: `Invalid role. Must be one of: ${validRoles.join(', ')}`
                })
            };
        }

        // Insertar participante
        const result = await client.query(
            `INSERT INTO parties (
                enterprise_id,
                name,
                email,
                role
            ) VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                enterpriseId,
                data.name,
                data.email,
                data.role
            ]
        );

        console.log('✅ Participante creado:', result.rows[0]);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Party created successfully',
                data: result.rows[0]
            })
        };
    } catch (error) {
        console.error('❌ Error creando participante:', error);
        
        if (error.code === '23505') { // Unique violation
            return {
                statusCode: 409,
                body: JSON.stringify({
                    error: 'Conflict',
                    details: 'Email already exists for this enterprise'
                })
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    } finally {
        client.release();
    }
};

// Manejador para listar participantes
const handleListParties = async (enterpriseId, queryParams) => {
    try {
        console.log('Listando participantes:', enterpriseId, queryParams);

        // Verificar si la empresa existe
        const checkResult = await pool.query(
            `SELECT * FROM enterprises WHERE id = $1 AND is_active = true`,
            [enterpriseId]
        );

        if (checkResult.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Not found',
                    details: 'Enterprise not found'
                })
            };
        }

        // Parámetros de paginación
        const page = parseInt(queryParams?.page) || 1;
        const limit = parseInt(queryParams?.limit) || 10;
        const offset = (page - 1) * limit;

        // Construir la consulta base
        let query = `
            SELECT * FROM parties 
            WHERE enterprise_id = $1 AND is_active = true
        `;
        const queryValues = [enterpriseId];
        let paramCounter = 2;

        // Agregar filtro por rol si existe
        if (queryParams?.role) {
            query += ` AND role = $${paramCounter}`;
            queryValues.push(queryParams.role);
            paramCounter++;
        }

        // Agregar ordenamiento y paginación
        query += ` ORDER BY created_at DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        queryValues.push(limit, offset);

        const result = await pool.query(query, queryValues);

        // Obtener el total de registros para la paginación
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM parties WHERE enterprise_id = $1 AND is_active = true`,
            [enterpriseId]
        );
        const total = parseInt(countResult.rows[0].count);

        console.log(`✅ ${result.rows.length} participantes encontrados`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Parties retrieved successfully',
                data: result.rows,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            })
        };
    } catch (error) {
        console.error('❌ Error listando participantes:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};

// Manejador para actualizar participante
const handleUpdateParty = async (enterpriseId, partyId, data) => {
    const client = await pool.connect();
    try {
        console.log('Actualizando participante:', enterpriseId, partyId, data);

        // Verificar si la empresa existe
        const checkEnterpriseResult = await client.query(
            `SELECT * FROM enterprises WHERE id = $1 AND is_active = true`,
            [enterpriseId]
        );

        if (checkEnterpriseResult.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Not found',
                    details: 'Enterprise not found'
                })
            };
        }

        // Verificar si el participante existe
        const checkPartyResult = await client.query(
            `SELECT * FROM parties WHERE id = $1 AND enterprise_id = $2 AND is_active = true`,
            [partyId, enterpriseId]
        );

        if (checkPartyResult.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Not found',
                    details: 'Party not found'
                })
            };
        }

        // Construir la consulta de actualización dinámicamente
        const updateFields = [];
        const updateValues = [];
        let paramCounter = 1;

        if (data.name) {
            updateFields.push(`name = $${paramCounter}`);
            updateValues.push(data.name);
            paramCounter++;
        }
        if (data.email) {
            updateFields.push(`email = $${paramCounter}`);
            updateValues.push(data.email);
            paramCounter++;
        }
        if (data.role) {
            // Validar rol
            const validRoles = ['ADMIN', 'EMPLOYEE'];
            if (!validRoles.includes(data.role)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: 'Bad request',
                        details: `Invalid role. Must be one of: ${validRoles.join(', ')}`
                    })
                };
            }
            updateFields.push(`role = $${paramCounter}`);
            updateValues.push(data.role);
            paramCounter++;
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

        // Si no hay campos para actualizar
        if (updateFields.length === 1) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Bad request',
                    details: 'No fields to update'
                })
            };
        }

        const query = `
            UPDATE parties 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCounter} AND enterprise_id = $${paramCounter + 1} AND is_active = true
            RETURNING *
        `;
        updateValues.push(partyId, enterpriseId);

        const result = await client.query(query, updateValues);

        console.log('✅ Participante actualizado:', result.rows[0]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Party updated successfully',
                data: result.rows[0]
            })
        };
    } catch (error) {
        console.error('❌ Error actualizando participante:', error);
        
        if (error.code === '23505') { // Unique violation
            return {
                statusCode: 409,
                body: JSON.stringify({
                    error: 'Conflict',
                    details: 'Email already exists for this enterprise'
                })
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    } finally {
        client.release();
    }
};

// Manejador para listar empresas por participante
const handleListPartyEnterprises = async (partyId, queryParams) => {
    try {
        console.log('Listando empresas por participante:', partyId, queryParams);

        // Verificar si el participante existe
        const checkResult = await pool.query(
            `SELECT * FROM parties WHERE id = $1 AND is_active = true`,
            [partyId]
        );

        if (checkResult.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Not found',
                    details: 'Party not found'
                })
            };
        }

        // Parámetros de paginación
        const page = parseInt(queryParams?.page) || 1;
        const limit = parseInt(queryParams?.limit) || 10;
        const offset = (page - 1) * limit;

        // Obtener las empresas donde el participante está activo
        const query = `
            SELECT e.* 
            FROM enterprises e
            INNER JOIN parties p ON p.enterprise_id = e.id
            WHERE p.id = $1 
            AND p.is_active = true 
            AND e.is_active = true
            ORDER BY e.created_at DESC
            LIMIT $2 OFFSET $3
        `;

        const result = await pool.query(query, [partyId, limit, offset]);

        // Obtener el total de registros para la paginación
        const countResult = await pool.query(
            `
            SELECT COUNT(*) 
            FROM enterprises e
            INNER JOIN parties p ON p.enterprise_id = e.id
            WHERE p.id = $1 
            AND p.is_active = true 
            AND e.is_active = true
            `,
            [partyId]
        );
        const total = parseInt(countResult.rows[0].count);

        console.log(`✅ ${result.rows.length} empresas encontradas`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Enterprises retrieved successfully',
                data: result.rows,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            })
        };
    } catch (error) {
        console.error('❌ Error listando empresas por participante:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};

// Handler principal
exports.handler = async (event) => {
    try {
        console.log('Evento recibido:', JSON.stringify(event, null, 2));
        
        const { httpMethod, body, pathParameters, queryStringParameters, path, resource } = event;
        const parsedBody = body ? JSON.parse(body) : {};

        console.log('Método HTTP:', httpMethod);
        console.log('Cuerpo:', parsedBody);
        console.log('Parámetros de ruta:', pathParameters);
        console.log('Parámetros de consulta:', queryStringParameters);
        console.log('Ruta:', path);
        console.log('Recurso:', resource);

        // Endpoints de empresas
        if (resource === '/enterprises') {
            if (httpMethod === 'GET') {
                return await handleListEnterprises();
            }
            if (httpMethod === 'POST') {
                return await handleCreateEnterprise(parsedBody);
            }
        }

        if (resource === '/enterprises/{id}') {
            if (!pathParameters || !pathParameters.id) {
                console.error('❌ ID no encontrado en pathParameters:', pathParameters);
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Bad Request',
                        details: 'Missing enterprise ID',
                        path: path,
                        resource: resource,
                        pathParameters: pathParameters
                    })
                };
            }

            const id = parseInt(pathParameters.id, 10);
            if (isNaN(id)) {
                console.error('❌ ID inválido:', pathParameters.id);
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Bad Request',
                        details: 'Invalid enterprise ID'
                    })
                };
            }

            console.log('ID procesado:', id);
            
            if (httpMethod === 'GET') {
                return await handleGetEnterprise(id);
            }
            if (httpMethod === 'PUT') {
                return await handleUpdateEnterprise(id, parsedBody);
            }
            if (httpMethod === 'DELETE') {
                return await handleDeleteEnterprise(id);
            }
        }

        // Endpoints de participantes
        if (resource === '/enterprises/{id}/parties') {
            if (!pathParameters || !pathParameters.id) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Bad Request',
                        details: 'Missing enterprise ID',
                        path: path,
                        resource: resource,
                        pathParameters: pathParameters
                    })
                };
            }

            const id = parseInt(pathParameters.id, 10);
            if (isNaN(id)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Bad Request',
                        details: 'Invalid enterprise ID'
                    })
                };
            }
            
            if (httpMethod === 'GET') {
                return await handleListParties(id, queryStringParameters || {});
            }
            if (httpMethod === 'POST') {
                return await handleCreateParty(id, parsedBody);
            }
        }

        if (resource === '/enterprises/{id}/parties/{partyId}') {
            if (!pathParameters || !pathParameters.id || !pathParameters.partyId) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Bad Request',
                        details: 'Missing enterprise ID or party ID',
                        path: path,
                        resource: resource,
                        pathParameters: pathParameters
                    })
                };
            }

            const id = parseInt(pathParameters.id, 10);
            const partyId = parseInt(pathParameters.partyId, 10);
            
            if (isNaN(id) || isNaN(partyId)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Bad Request',
                        details: 'Invalid enterprise ID or party ID'
                    })
                };
            }
            
            if (httpMethod === 'PUT') {
                return await handleUpdateParty(id, partyId, parsedBody);
            }
        }

        // Endpoint para listar empresas por participante
        if (resource === '/parties/{id}/enterprises') {
            if (!pathParameters || !pathParameters.id) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Bad Request',
                        details: 'Missing party ID',
                        path: path,
                        resource: resource,
                        pathParameters: pathParameters
                    })
                };
            }

            const id = parseInt(pathParameters.id, 10);
            if (isNaN(id)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Bad Request',
                        details: 'Invalid party ID'
                    })
                };
            }
            
            if (httpMethod === 'GET') {
                return await handleListPartyEnterprises(id, queryStringParameters || {});
            }
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ 
                error: 'Not found',
                path: path,
                resource: resource,
                method: httpMethod,
                pathParameters: pathParameters
            })
        };
    } catch (error) {
        console.error('❌ Error en handler:', error);
        console.error('Stack:', error.stack);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message,
                stack: error.stack
            })
        };
    }
};
