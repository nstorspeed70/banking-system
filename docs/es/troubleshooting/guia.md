# Guía de Solución de Problemas

## Problemas Comunes

### 1. Error de Autenticación (401 Unauthorized)

**Síntoma**
```json
{
  "message": "Unauthorized"
}
```

**Posibles Causas**
1. Token de autenticación expirado
2. Token mal formado
3. Token no incluido en el header

**Solución**
1. Obtener un nuevo token:
```bash
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id YOUR_CLIENT_ID \
  --auth-parameters USERNAME=user@example.com,PASSWORD=password
```

2. Verificar que el token se envía correctamente:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" ...
```

### 2. Error de Validación (400 Bad Request)

**Síntoma**
```json
{
  "message": "Validation error",
  "errors": [...]
}
```

**Posibles Causas**
1. Formato de RUC inválido
2. Email mal formado
3. Campos requeridos faltantes

**Solución**
1. Verificar el formato de RUC (11 dígitos)
2. Validar formato de email
3. Revisar documentación de API para campos requeridos

### 3. Error de Base de Datos (503 Service Unavailable)

**Síntoma**
```json
{
  "message": "Database connection error"
}
```

**Posibles Causas**
1. Base de datos no disponible
2. Problemas de red
3. Configuración incorrecta

**Solución**
1. Verificar estado de RDS:
```bash
aws rds describe-db-instances --db-instance-identifier sistema-bancario-db
```

2. Verificar conectividad:
```bash
nc -zv sistema-bancario-db.xxxx.region.rds.amazonaws.com 5432
```

### 4. Error de Lambda (500 Internal Server Error)

**Síntoma**
```json
{
  "message": "Internal server error"
}
```

**Posibles Causas**
1. Error en el código Lambda
2. Timeout de función
3. Memoria insuficiente

**Solución**
1. Revisar logs en CloudWatch:
```bash
aws logs get-log-events \
  --log-group-name /aws/lambda/sistema-bancario-enterprises \
  --log-stream-name LATEST
```

2. Verificar configuración de Lambda:
```bash
aws lambda get-function-configuration \
  --function-name sistema-bancario-enterprises
```

## Herramientas de Diagnóstico

### 1. Script de Diagnóstico General
```bash
./scripts/diagnostico.sh
```

Este script verifica:
- Conectividad a servicios AWS
- Estado de la base de datos
- Funciones Lambda
- API Gateway
- Cognito

### 2. Verificación de Logs
```bash
./scripts/ver-logs.sh
```

Muestra los últimos logs de:
- API Gateway
- Lambda
- RDS
- CloudWatch

### 3. Monitoreo de Eventos
```bash
./scripts/ver-eventos.sh
```

Muestra:
- Eventos del sistema
- Errores recientes
- Métricas de rendimiento

## Contacto y Soporte

Si los problemas persisten:

1. Abrir un issue en GitHub con:
   - Descripción detallada
   - Logs relevantes
   - Pasos para reproducir

2. Contactar al equipo de soporte:
   - Email: soporte@sistema-bancario.com
   - Slack: #sistema-bancario-support
