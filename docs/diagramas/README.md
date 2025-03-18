# Sistema Bancario - Documentación

## Descripción General
Sistema de gestión bancaria que permite administrar empresas y sus miembros asociados. Implementado siguiendo los principios de Clean Architecture, Domain-Driven Design (DDD) y Command Query Responsibility Segregation (CQRS).

## Arquitectura

### Patrones y Principios
- **Clean Architecture**: Separación clara de responsabilidades en capas
- **Domain-Driven Design**: Modelado del dominio con agregados, entidades y objetos de valor
- **CQRS**: Separación de operaciones de lectura y escritura
- **Event-Driven**: Comunicación asíncrona mediante eventos de dominio

### Componentes Principales
1. **API Gateway**: Punto de entrada para todas las operaciones
2. **Lambda Functions**: Procesamiento de comandos y consultas
3. **PostgreSQL**: Almacenamiento principal de datos
4. **EventBridge**: Bus de eventos para comunicación asíncrona
5. **Cognito**: Autenticación y autorización de usuarios

## Endpoints

### Empresas (Enterprises)

#### POST /enterprises
Crear una nueva empresa.
```json
{
    "taxId": "PE12345678901",
    "legalBusinessName": "Empresa S.A.C.",
    "enterpriseType": "SAC",
    "contactEmail": "contacto@empresa.com",
    "contactPhone": "+51999888777"
}
```

#### GET /enterprises
Listar empresas activas.

#### GET /enterprises/{id}
Obtener detalles de una empresa específica.

#### PUT /enterprises/{id}
Actualizar información de una empresa.
```json
{
    "legalBusinessName": "Nuevo Nombre S.A.C.",
    "contactEmail": "nuevo@empresa.com",
    "contactPhone": "+51999888777"
}
```

#### DELETE /enterprises/{id}
Eliminar una empresa (soft delete).

### Miembros (Parties)

#### POST /enterprises/{id}/parties
Agregar un nuevo miembro a una empresa.
```json
{
    "name": "Juan Pérez",
    "email": "juan.perez@empresa.com",
    "role": "ADMIN"
}
```
**Roles disponibles**: `ADMIN`, `EMPLOYEE`, `READ_ONLY`

#### GET /enterprises/{id}/parties
Listar miembros de una empresa.
- **Parámetros**:
  - `page`: Número de página (default: 1)
  - `limit`: Registros por página (default: 10)
  - `role`: Filtrar por rol

#### PUT /enterprises/{id}/parties/{partyId}
Actualizar información de un miembro.
```json
{
    "name": "Juan Pérez Actualizado",
    "email": "juan.nuevo@empresa.com",
    "role": "EMPLOYEE"
}
```

#### GET /parties/{partyId}/enterprises
Obtener todas las empresas asociadas a un miembro.

## Modelos de Dominio

### Enterprise (Empresa)
```typescript
interface Enterprise {
    id: string;
    taxId: TaxId;           // PE + 11 dígitos
    legalBusinessName: string;
    enterpriseType: 'SRL' | 'SAC' | 'SA';
    contactEmail: Email;
    contactPhone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
```

### Party (Miembro)
```typescript
interface Party {
    id: string;
    name: string;
    email: Email;
    role: PartyRole;        // ADMIN, EMPLOYEE, READ_ONLY
    enterpriseId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
```

## Validaciones

### Empresas
- RUC (taxId): Formato PE + 11 dígitos
- Razón Social: Mínimo 3 caracteres
- Tipo de Empresa: SRL, SAC o SA
- Email de contacto: Formato válido de email
- Teléfono: Formato internacional (+51999888777)

### Miembros
- Nombre: No puede estar vacío
- Email: Formato válido y único en el sistema
- Rol: ADMIN, EMPLOYEE o READ_ONLY
- Empresa: Debe existir y estar activa

## Seguridad
- Autenticación mediante AWS Cognito
- Autorización basada en tokens JWT
- Todas las operaciones requieren autenticación
- SSL/TLS para todas las comunicaciones
- Validación de entrada en todos los endpoints

## Infraestructura

### AWS Services
- API Gateway
- Lambda Functions
- RDS PostgreSQL
- EventBridge
- Cognito
- CloudWatch (logs)
- VPC con subnets públicas y privadas

### Base de Datos
- PostgreSQL en RDS
- Índices optimizados para búsquedas frecuentes
- Soft delete para mantener historial
- Triggers para actualización automática de timestamps
- Foreign keys para integridad referencial

## Desarrollo Local

### Requisitos
- Node.js 18+
- AWS CLI configurado
- Terraform
- PostgreSQL (opcional, para desarrollo local)

### Configuración
1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno
4. Ejecutar migraciones: `npm run migrate`
5. Iniciar servidor local: `npm run dev`

### Variables de Entorno
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=****
DB_NAME=sistema_bancario
AWS_REGION=us-east-1
```

## Despliegue

### Terraform
1. Inicializar: `terraform init`
2. Planificar cambios: `terraform plan`
3. Aplicar cambios: `terraform apply`

### CI/CD
- GitHub Actions para CI
- Despliegue automático en merge a main
- Tests automáticos antes del despliegue
- Validación de código con ESLint

## Testing
- Unit tests con Jest
- Integration tests con Supertest
- E2E tests con Postman
- Coverage mínimo: 80%

## Monitoreo
- CloudWatch Logs
- Métricas de API Gateway
- Alertas configuradas
- Tracing con X-Ray

## Mantenimiento
- Backups diarios de la base de datos
- Rotación de logs cada 30 días
- Actualizaciones de dependencias mensuales
- Review de seguridad trimestral
