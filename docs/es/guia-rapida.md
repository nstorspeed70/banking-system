# Guía Rápida del Sistema Bancario

> **Nota sobre el idioma**: Este documento está en español para facilitar el uso y diagnóstico del sistema. Sin embargo, todo el código fuente, nombres de funciones, variables y documentación técnica están en inglés siguiendo las mejores prácticas de desarrollo.

## Introducción
Este sistema implementa una API bancaria utilizando:
- Clean Architecture
- Domain-Driven Design (DDD)
- Command Query Responsibility Segregation (CQRS)
- Event-Driven Architecture

## Inicio Rápido

### 1. Configurar AWS
```bash
# Configurar credenciales
aws configure

# Verificar configuración
source terraform/config_aws.sh
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Crear Infraestructura
```bash
cd terraform
terraform init
terraform apply -auto-approve
```

## Comandos Comunes

### Gestión de Empresas
```bash
# Variables de entorno
export API_URL="https://cvy20g7osc.execute-api.us-east-1.amazonaws.com/dev"
export TOKEN="tu-token-de-cognito"

# Crear empresa
curl -X POST "$API_URL/enterprises" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "taxId": "PE12345678901",
    "legalBusinessName": "Mi Empresa SRL",
    "enterpriseType": "SRL",
    "contactEmail": "contacto@miempresa.com"
  }'

# Listar empresas
curl -H "Authorization: $TOKEN" "$API_URL/enterprises"

# Obtener empresa específica
curl -H "Authorization: $TOKEN" "$API_URL/enterprises/{id}"
```

### Monitoreo del Sistema
```bash
# Ver estado general
./scripts/diagnostico.sh

# Ver últimos eventos
./scripts/ver-eventos.sh

# Ver logs con filtro
./scripts/ver-logs.sh | grep "❌"  # Ver errores
./scripts/ver-logs.sh | grep "✅"  # Ver éxitos
```

### Gestión de Infraestructura
```bash
# Actualizar sistema
cd terraform && terraform apply -auto-approve

# Verificar estado
terraform show

# Eliminar recursos
terraform destroy -auto-approve
```

## Scripts de Diagnóstico

### Diagnóstico General
```bash
./scripts/diagnostico.sh
```
Verifica:
- Credenciales de AWS
- Estado de servicios AWS (Lambda, DynamoDB, etc.)
- Base de datos PostgreSQL
- Logs del sistema
- Eventos recientes

### Ver Logs del Sistema
```bash
./scripts/ver-logs.sh
```
Muestra:
- Logs de Lambda con formato amigable
- Colores para diferentes tipos de mensajes
- Resaltado de errores y advertencias

### Ver Eventos del Sistema
```bash
./scripts/ver-eventos.sh
```
Muestra:
- Eventos por tipo (creación, actualización, eliminación)
- Ordenados por fecha
- Detalles completos de cada evento

## Solución de Problemas Comunes

### 1. Error de Credenciales
```bash
# Actualizar credenciales
source terraform/config_aws.sh

# Verificar configuración
aws sts get-caller-identity
```

### 2. Error en Lambda
```bash
# Ver logs recientes
./scripts/ver-logs.sh

# Forzar actualización
cd terraform && terraform apply -auto-approve
```

### 3. Problemas de Red
```bash
# Verificar conectividad con la base de datos
nc -zv sistema-bancario-db.c6daoieako9t.us-east-1.rds.amazonaws.com 5432

# Verificar API Gateway
curl -I "$API_URL/health"
```

### 4. Limpiar Recursos
```bash
# Eliminar toda la infraestructura
cd terraform && terraform destroy -auto-approve

# Verificar eliminación
aws dynamodb list-tables
aws lambda list-functions
```

## Estructura del Proyecto
```
src/
├── domain/          # Capa de dominio
├── application/     # Capa de aplicación (casos de uso)
├── infrastructure/  # Capa de infraestructura
└── interface/       # Capa de interfaz (API)
```

> **Nota**: Aunque esta guía está en español para facilitar su uso, todo el código, nombres de funciones, variables y documentación técnica están en inglés siguiendo las mejores prácticas de desarrollo.
