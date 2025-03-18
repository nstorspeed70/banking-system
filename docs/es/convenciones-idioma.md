# 🌎 Convenciones de Idioma

## Introducción

Este proyecto sigue una convención bilingüe específica para facilitar tanto el desarrollo profesional como la operación y diagnóstico del sistema.

## Español

Se utiliza español en:

### 1. Interacción con Usuario
- 💬 Mensajes de error al usuario final
- 📝 Mensajes de confirmación
- ❌ Mensajes de validación de datos

### 2. Diagnóstico y Monitoreo
- 📋 Logs del sistema
- 🔍 Mensajes de depuración
- ⚠️ Advertencias y errores técnicos

### 3. Scripts y Herramientas
- 🛠️ Scripts de diagnóstico
- 🔧 Herramientas de mantenimiento
- 📊 Reportes y estadísticas

### 4. Documentación de Uso
- 📚 Guías de usuario
- 🚀 Guías de inicio rápido
- ❓ Solución de problemas

## English (Inglés)

Se utiliza inglés en:

### 1. Código Fuente
- 🏗️ Nombres de clases y funciones
- 📦 Nombres de variables
- 💻 Comentarios técnicos

### 2. Documentación Técnica
- 📘 Documentación de API (Swagger)
- 🔌 Interfaces y contratos
- 🏛️ Documentación de arquitectura

### 3. Nombres de Recursos
- 🗄️ Tablas y columnas
- 📁 Archivos y directorios
- 🔑 Variables de entorno

### 4. Eventos y Comandos
- 🔄 Nombres de eventos
- ⚡ Nombres de comandos
- 📡 Nombres de queries

## Ejemplos

### Código y Logs
```typescript
// Código en inglés
class EnterpriseService {
    async createEnterprise(command: CreateEnterpriseCommand): Promise<void> {
        // Logs en español
        this.logger.log('📝 Procesando solicitud de creación de empresa...');
        
        try {
            await this.repository.save(enterprise);
            this.logger.log('✅ Empresa creada exitosamente');
        } catch (error) {
            this.logger.error('❌ Error al crear la empresa:', error);
            throw new DomainException('No se pudo crear la empresa');
        }
    }
}
```

### Mensajes de Error
```typescript
// Clase de error en inglés
class ValidationError extends Error {
    constructor(message: string) {
        // Mensaje en español
        super(message);
        this.name = 'ValidationError';
    }
}

// Uso
throw new ValidationError('El RUC ingresado no es válido');
```

### Documentación API
```typescript
// Documentación Swagger en inglés
@ApiOperation({ summary: 'Create new enterprise' })
@ApiResponse({ 
    status: 201, 
    description: 'Enterprise created successfully',
    // Mensajes de ejemplo en español
    schema: { 
        example: { 
            message: 'Empresa creada exitosamente',
            id: 'emp-123' 
        }
    }
})
```

## Recomendaciones

### 1. Consistencia
- ✅ Mantener la convención en todo el proyecto
- ❌ No mezclar idiomas en el mismo contexto
- 🔄 Ser consistente en cada capa

### 2. Claridad
- 📝 Usar mensajes claros y concisos
- 🎯 Evitar traducciones literales
- 💡 Priorizar la comprensión

### 3. Documentación
- 📚 Documentar las convenciones
- 🔍 Revisar regularmente
- 📋 Mantener ejemplos actualizados

## Scripts de Verificación

### Verificar Convenciones
```bash
# Ver logs del sistema
./scripts/ver-logs.sh

# Verificar mensajes de error
./scripts/diagnostico.sh

# Revisar documentación API
./scripts/ver-api-docs.sh
```

## Notas Importantes

1. **Código vs. Mensajes**
   - 💻 Código siempre en inglés
   - 💬 Mensajes siempre en español

2. **Documentación**
   - 📘 Técnica en inglés
   - 📖 Usuario en español

3. **Logs y Diagnóstico**
   - 📝 Mensajes en español
   - 🔑 Variables en inglés

4. **Commits y PR**
   - 📝 Mensajes en inglés
   - 📋 Descripciones técnicas en inglés
