# Endpoints de la API

## Empresas

### GET /enterprises
Lista todas las empresas con paginación y filtrado.

**Parámetros de Query**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `type`: Tipo de empresa (SAC, EIRL)

**Ejemplo de Respuesta**
```json
{
  "message": "Enterprises retrieved successfully",
  "data": [
    {
      "id": 1,
      "tax_id": "20123456789",
      "legal_business_name": "Empresa Ejemplo SAC",
      "enterprise_type": "SAC",
      "contact_email": "contacto@empresa.com",
      "contact_phone": "+51999888777",
      "is_active": true,
      "created_at": "2025-03-17T14:37:24.154Z",
      "updated_at": "2025-03-17T14:37:24.154Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET /enterprises/{id}
Obtiene los detalles de una empresa específica.

**Parámetros de Path**
- `id`: ID de la empresa

**Ejemplo de Respuesta**
```json
{
  "message": "Enterprise retrieved successfully",
  "data": {
    "id": 1,
    "tax_id": "20123456789",
    "legal_business_name": "Empresa Ejemplo SAC",
    "enterprise_type": "SAC",
    "contact_email": "contacto@empresa.com",
    "contact_phone": "+51999888777",
    "is_active": true,
    "created_at": "2025-03-17T14:37:24.154Z",
    "updated_at": "2025-03-17T14:37:24.154Z"
  }
}
```

### POST /enterprises
Crea una nueva empresa.

**Body**
```json
{
  "tax_id": "20123456789",
  "legal_business_name": "Empresa Ejemplo SAC",
  "enterprise_type": "SAC",
  "contact_email": "contacto@empresa.com",
  "contact_phone": "+51999888777"
}
```

**Ejemplo de Respuesta**
```json
{
  "message": "Enterprise created successfully",
  "data": {
    "id": 1,
    "tax_id": "20123456789",
    "legal_business_name": "Empresa Ejemplo SAC",
    "enterprise_type": "SAC",
    "contact_email": "contacto@empresa.com",
    "contact_phone": "+51999888777",
    "is_active": true,
    "created_at": "2025-03-17T14:37:24.154Z",
    "updated_at": "2025-03-17T14:37:24.154Z"
  }
}
```

### PUT /enterprises/{id}
Actualiza una empresa existente.

**Parámetros de Path**
- `id`: ID de la empresa

**Body**
```json
{
  "legal_business_name": "Empresa Ejemplo SAC Actualizada",
  "contact_email": "nuevo@empresa.com",
  "contact_phone": "+51999888666"
}
```

**Ejemplo de Respuesta**
```json
{
  "message": "Enterprise updated successfully",
  "data": {
    "id": 1,
    "tax_id": "20123456789",
    "legal_business_name": "Empresa Ejemplo SAC Actualizada",
    "enterprise_type": "SAC",
    "contact_email": "nuevo@empresa.com",
    "contact_phone": "+51999888666",
    "is_active": true,
    "created_at": "2025-03-17T14:37:24.154Z",
    "updated_at": "2025-03-17T15:00:00.000Z"
  }
}
```

### DELETE /enterprises/{id}
Elimina (soft delete) una empresa.

**Parámetros de Path**
- `id`: ID de la empresa

**Ejemplo de Respuesta**
```json
{
  "message": "Enterprise deleted successfully"
}
```

## Participantes

### POST /enterprises/{id}/parties
Agrega un nuevo participante a una empresa.

**Parámetros de Path**
- `id`: ID de la empresa

**Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "EMPLOYEE"
}
```

**Ejemplo de Respuesta**
```json
{
  "message": "Party created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "EMPLOYEE",
    "is_active": true,
    "created_at": "2025-03-17T15:00:00.000Z",
    "updated_at": "2025-03-17T15:00:00.000Z"
  }
}
```

### PUT /enterprises/{id}/parties/{partyId}
Actualiza un participante de una empresa.

**Parámetros de Path**
- `id`: ID de la empresa
- `partyId`: ID del participante

**Body**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "ADMIN"
}
```

**Ejemplo de Respuesta**
```json
{
  "message": "Party updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "ADMIN",
    "is_active": true,
    "created_at": "2025-03-17T15:00:00.000Z",
    "updated_at": "2025-03-17T15:30:00.000Z"
  }
}
```

### GET /enterprises/{id}/parties
Lista todos los participantes de una empresa.

**Parámetros de Path**
- `id`: ID de la empresa

**Parámetros de Query**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `role`: Filtrar por rol (ADMIN, EMPLOYEE)

**Ejemplo de Respuesta**
```json
{
  "message": "Parties retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "EMPLOYEE",
      "is_active": true,
      "created_at": "2025-03-17T15:00:00.000Z",
      "updated_at": "2025-03-17T15:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET /parties/{partyId}/enterprises
Lista todas las empresas asociadas a un participante.

**Parámetros de Path**
- `partyId`: ID del participante

**Parámetros de Query**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

**Ejemplo de Respuesta**
```json
{
  "message": "Enterprises retrieved successfully",
  "data": [
    {
      "id": 1,
      "tax_id": "20123456789",
      "legal_business_name": "Empresa Ejemplo SAC",
      "enterprise_type": "SAC",
      "contact_email": "contacto@empresa.com",
      "contact_phone": "+51999888777",
      "is_active": true,
      "created_at": "2025-03-17T14:37:24.154Z",
      "updated_at": "2025-03-17T14:37:24.154Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```
