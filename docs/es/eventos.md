# 🔄 Sistema de Eventos

> **Nota sobre el idioma**: Este documento está en español para facilitar el diagnóstico y monitoreo del sistema. Los nombres técnicos (eventos, comandos, funciones) se mantienen en inglés siguiendo las mejores prácticas de desarrollo, pero todos los mensajes de diagnóstico y logs están en español para facilitar la operación.

## Introducción
Nuestro sistema utiliza una arquitectura basada en eventos siguiendo los principios de Domain-Driven Design (DDD). Los eventos capturan cambios importantes en el dominio y permiten una arquitectura desacoplada.

## Eventos Disponibles

### 1. Eventos de Empresa
- **EnterpriseCreated**: Creación de una nueva empresa
- **EnterpriseUpdated**: Actualización de datos de empresa
- **EnterpriseDeleted**: Eliminación de empresa

> **Nota**: Los nombres de los eventos están en inglés siguiendo las convenciones del proyecto, pero su documentación y mensajes están en español.

## Estructura de Eventos

### Ejemplo de Evento
```typescript
// Estructura común de eventos
interface DomainEvent {
    id: string;              // Identificador único del evento
    timestamp: string;       // Fecha y hora del evento
    eventType: string;       // Tipo de evento (ej: EnterpriseCreated)
    source: string;         // Origen del evento
    detail: {              // Detalles específicos del evento
        id: string;        // ID de la entidad
        // ... otros campos específicos del evento
    };
}
```

## Infraestructura de Eventos

### Servicios AWS Utilizados
1. **EventBridge**
   - Bus de eventos: `sistema-bancario-events`
   - Maneja el enrutamiento de eventos

2. **Lambda**
   - Función: `sistema-bancario-event-processor`
   - Procesa los eventos y los almacena

3. **DynamoDB**
   - Tabla: `sistema-bancario-auditoria`
   - Almacena el historial de eventos

## Manejo de Eventos

### Eventos del Dominio

#### Eventos de Empresa
1. **EnterpriseCreated**
   ```typescript
   // Evento de creación de empresa
   interface EnterpriseCreatedEvent {
       id: string;              // UUID del evento
       timestamp: string;       // Fecha y hora
       eventType: 'EnterpriseCreated';
       detail: {
           id: string;          // ID de la empresa
           taxId: string;       // RUC/NIT
           legalBusinessName: string;
           enterpriseType: string;
           contactEmail: string;
       }
   }
   ```

2. **EnterpriseUpdated**
   ```typescript
   // Evento de actualización de empresa
   interface EnterpriseUpdatedEvent {
       id: string;
       timestamp: string;
       eventType: 'EnterpriseUpdated';
       detail: {
           id: string;
           changes: string[];   // Campos actualizados
           // ... detalles del cambio
       }
   }
   ```

3. **EnterpriseDeleted**
   ```typescript
   // Evento de eliminación de empresa
   interface EnterpriseDeletedEvent {
       id: string;
       timestamp: string;
       eventType: 'EnterpriseDeleted';
       detail: {
           id: string;
           reason?: string;
       }
   }
   ```

### Flujo de Eventos

#### 1. Publicación
```typescript
// Código en inglés
await eventBridge.putEvents({
    Entries: [{
        EventBusName: 'sistema-bancario-events',
        Source: 'sistema-bancario.enterprises',
        DetailType: 'EnterpriseCreated',
        Detail: JSON.stringify({
            id: 'emp-123',
            taxId: 'PE12345678901'
            // ... más detalles
        })
    }]
}).promise();

// Mensaje de log en español
console.log('✅ Evento de creación de empresa publicado');
```

#### 2. Procesamiento
```typescript
// Handler de Lambda en inglés
export const handler = async (event: any) => {
    console.log('📥 Evento recibido:', event);
    
    try {
        await processEvent(event);
        console.log('✅ Evento procesado exitosamente');
    } catch (error) {
        console.error('❌ Error al procesar evento:', error);
        throw error;
    }
};
```

#### 3. Almacenamiento
```typescript
// Guardar en DynamoDB (código en inglés)
await dynamodb.put({
    TableName: 'sistema-bancario-auditoria',
    Item: {
        id: event.id,
        timestamp: event.timestamp,
        eventType: event.detailType,
        detail: event.detail
    }
}).promise();

// Mensaje de log en español
console.log('💾 Evento guardado en la tabla de auditoría');
```

## Monitoreo y Diagnóstico

### Ver Eventos en Tiempo Real
```bash
# Ver últimos eventos
./scripts/ver-eventos.sh

# Ver eventos con más detalle
DEBUG=* ./scripts/ver-eventos.sh
```

### Consultar Logs
```bash
# Ver logs del procesador de eventos
./scripts/ver-logs.sh
```

### Verificar Estado del Sistema
```bash
# Diagnóstico completo
./scripts/diagnostico.sh
```

## Ejemplos de Uso

### 1. Monitoreo de Eventos
```bash
# Ver eventos de creación de empresas
aws dynamodb query \
  --table-name sistema-bancario-auditoria \
  --index-name eventType-index \
  --key-condition-expression "eventType = :type" \
  --expression-attribute-values '{":type":{"S":"EnterpriseCreated"}}'
```

### 2. Análisis de Logs
```bash
# Ver logs de errores
./scripts/ver-logs.sh | grep "❌"

# Ver eventos exitosos
./scripts/ver-logs.sh | grep "✅"
```

## Solución de Problemas

### Eventos No Aparecen
1. Verificar credenciales:
   ```bash
   source terraform/config_aws.sh
   ```

2. Verificar Lambda:
   ```bash
   ./scripts/ver-logs.sh
   ```

3. Verificar EventBridge:
   ```bash
   ./scripts/diagnostico.sh
   ```

### Errores Comunes
1. **Error de Permisos**: Verificar roles IAM
2. **Eventos Duplicados**: Verificar índices DynamoDB
3. **Eventos Perdidos**: Revisar logs de Lambda

## Buenas Prácticas

### Nomenclatura
- 📝 Nombres de eventos en inglés (ej: `EnterpriseCreated`)
- 💬 Mensajes de error en español
- 📋 Logs en español para facilitar diagnóstico

### Monitoreo
- ✅ Verificar logs regularmente
- 🔍 Mantener índices actualizados
- 📊 Revisar métricas de AWS

### Mantenimiento
- 🧹 Limpiar eventos antiguos
- 📦 Hacer respaldos periódicos
- 🔄 Actualizar infraestructura

> **Nota**: Aunque los nombres técnicos y el código están en inglés, mantenemos los mensajes y documentación de uso en español para facilitar el diagnóstico y la operación del sistema.
