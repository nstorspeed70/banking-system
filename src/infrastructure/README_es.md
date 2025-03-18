# Infraestructura del Sistema Bancario

## Descripción General
Este módulo implementa la capa de infraestructura para nuestro sistema bancario, siguiendo los principios de Clean Architecture, DDD y CQRS.

## Servicios Implementados

### 1. Autenticación (Cognito)
- **Pool de Usuarios**: `sistema-bancario-users`
- **Características**:
  - Verificación por email
  - Políticas de contraseña seguras
  - Atributos personalizados para roles
  - Integración OAuth2

### 2. Eventos de Dominio (EventBridge)
- **Bus de Eventos**: `sistema-bancario-events`
- **Eventos Soportados**:
  - EnterpriseCreated
  - EnterpriseUpdated
- **Procesamiento**: Lambda function

### 3. Base de Datos
- **PostgreSQL (RDS)**:
  - Instancia: db.t3.micro
  - Usuario: dbmaster
  - Puerto: 5432
- **DynamoDB**:
  - Tabla de Auditoría
  - Modo bajo demanda

## Configuración del Entorno

1. **Variables de Entorno**:
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar con tus valores
   nano .env
   ```

2. **Instalación**:
   ```bash
   # Instalar dependencias
   npm install --legacy-peer-deps
   ```

3. **Verificación**:
   ```bash
   # Compilar el proyecto
   npm run build
   
   # Iniciar en modo desarrollo
   npm run start:dev
   ```

## Integración con Clean Architecture

### Capa de Dominio
- Los servicios de infraestructura implementan interfaces del dominio
- Los eventos de dominio se publican a través de EventBridge
- La auditoría se mantiene en DynamoDB

### Capa de Aplicación
- Autenticación y autorización mediante Cognito
- Queries utilizan PostgreSQL
- Commands generan eventos de dominio

## Costos (Capa Gratuita AWS)

### Primer Año
- Cognito: 50,000 usuarios activos/mes
- RDS: 750 horas/mes
- EventBridge: 1M eventos/mes
- Lambda: 1M solicitudes/mes
- DynamoDB: Modo bajo demanda

### Después del Primer Año
- Costo estimado: $15-25/mes
- Principalmente RDS y DynamoDB

## Seguridad

1. **Autenticación**:
   - OAuth2 con Cognito
   - MFA disponible
   - Tokens JWT seguros

2. **Base de Datos**:
   - Acceso restringido por VPC
   - Cifrado en reposo
   - Backups automáticos

3. **Eventos**:
   - Bus de eventos privado
   - Permisos IAM mínimos
   - Auditoría completa

## Monitoreo y Logs

- CloudWatch para métricas
- DynamoDB para auditoría
- Logs de aplicación centralizados

## Soporte y Mantenimiento

1. **Actualizaciones**:
   - Terraform gestiona la infraestructura
   - Versionado semántico
   - Migraciones automáticas

2. **Backup**:
   - RDS: Diario
   - DynamoDB: Bajo demanda
   - S3: Versionado

3. **Recuperación**:
   - Plan de DR documentado
   - RPO/RTO definidos
   - Procedimientos de rollback
