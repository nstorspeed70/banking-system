# Infraestructura del Sistema Bancario

## Descripción General
Este repositorio contiene la infraestructura como código (IaC) para el sistema bancario, implementada usando Terraform y servicios de la capa gratuita de AWS.

## Componentes de la Arquitectura

### 1. Autenticación (Amazon Cognito)
- **Pool de Usuarios**: `sistema-bancario-users`
  - Verificación por email
  - Políticas de contraseña seguras
  - Recuperación de cuenta por email
  - Atributos personalizados para roles empresariales
- **Configuración del Cliente**:
  - OAuth2 habilitado
  - URLs de callback configuradas
  - Validez de tokens:
    - Token de Actualización: 30 días
    - Token de Acceso: 1 hora
    - Token de ID: 1 hora

### 2. Eventos de Dominio (EventBridge)
- **Bus de Eventos**: `sistema-bancario-events`
- **Patrones de Eventos**:
  - EnterpriseCreated (Empresa Creada)
  - EnterpriseUpdated (Empresa Actualizada)
- **Integración con Lambda**:
  - Procesamiento de eventos
  - Registro de auditoría
  - Operaciones asíncronas

### 3. Capa de Base de Datos
- **PostgreSQL (RDS)**:
  - Instancia: db.t3.micro (Capa Gratuita)
  - Almacenamiento: 20GB gp2
  - Copias de seguridad automatizadas
- **DynamoDB**:
  - Registro de auditoría
  - Precio por solicitud
  - Elegible para capa gratuita

### 4. Configuración de Red
- **VPC**: `10.0.0.0/16`
- **Subred Pública**: `10.0.1.0/24`
- **Grupos de Seguridad**:
  - Acceso a RDS
  - Permisos de Lambda
  - Reglas del bus de eventos

## Estimación de Costos (Capa Gratuita)

### Primer Año (Beneficios de Capa Gratuita)
1. **Cognito**:
   - 50,000 MAU (Usuarios Activos Mensuales)
   - Características de autenticación gratuitas
   - MFA gratuito

2. **RDS PostgreSQL**:
   - 750 horas/mes
   - 20GB almacenamiento
   - Copias de seguridad automatizadas gratuitas

3. **EventBridge**:
   - Primer millón de eventos/mes
   - Bus de eventos personalizado incluido

4. **Lambda**:
   - 1M solicitudes gratuitas/mes
   - 400,000 GB-segundos/mes

### Después de la Capa Gratuita
- Costo mensual estimado: $15-25
- Costos principales:
  - RDS: ~$13-15/mes
  - DynamoDB: $0-5/mes
  - Otros servicios: Costo mínimo

## Características de Seguridad
- Verificación de email habilitada
- Políticas de contraseña seguras
- Roles IAM con permisos mínimos
- Grupos de seguridad VPC
- Almacenamiento de base de datos cifrado

## Instrucciones de Despliegue

1. **Prerequisitos**:
   ```bash
   # Instalar herramientas requeridas
   brew install terraform awscli
   ```

2. **Configuración de AWS**:
   ```bash
   # Configurar credenciales AWS
   aws configure
   ```

3. **Despliegue de Infraestructura**:
   ```bash
   # Inicializar Terraform
   terraform init

   # Revisar cambios
   terraform plan

   # Aplicar cambios
   terraform apply
   ```

## Integración con Clean Architecture
Esta infraestructura soporta:
- Diseño Dirigido por el Dominio (DDD)
- Patrón CQRS
- Principios de Clean Architecture
- Arquitectura dirigida por eventos

## Variables de Entorno
Variables de entorno requeridas:
```bash
export TF_VAR_db_password="tu_contraseña_segura"
export TF_VAR_ambiente="dev"
```

## Mejores Prácticas
1. Mantener credenciales en `~/.aws/credentials`
2. Nunca subir datos sensibles
3. Usar variables de entorno para secretos
4. Monitorear AWS Cost Explorer
5. Auditorías de seguridad regulares

## Soporte
Para preguntas o problemas:
1. Revisar documentación de AWS
2. Consultar registro de Terraform
3. Contactar al equipo de desarrollo
