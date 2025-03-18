# Banking System Technical Documentation

> **Language Convention Note**: This technical documentation is in English following development best practices. However, all user-facing messages, logs, and diagnostic tools are in Spanish to facilitate system operation and troubleshooting for our Spanish-speaking users.

## Architecture Overview

### Clean Architecture Implementation
The system follows Clean Architecture principles with the following layers:

1. **Domain Layer**
   - Core business logic
   - Domain entities and value objects
   - Domain events
   - Repository interfaces

2. **Application Layer**
   - Use cases
   - CQRS implementation
   - Event handlers
   - Application services

3. **Infrastructure Layer**
   - Repository implementations
   - External service integrations
   - AWS service configurations

4. **Interface Layer**
   - REST API controllers
   - DTO mappings
   - Request/Response models

### Domain-Driven Design (DDD)

#### Aggregates
```typescript
// Enterprise aggregate root with value objects
class EnterpriseAggregate extends AggregateRoot {
    constructor(
        private readonly id: string,
        private readonly taxId: TaxId,
        private readonly legalBusinessName: string,
        private readonly enterpriseType: EnterpriseType,
        private readonly contactEmail: Email
    ) {
        super();
    }

    // Domain methods in English
    public updateContactInfo(email: Email): void {
        this.validateEmail(email);
        this.contactEmail = email;
        // Event name in English, but message in Spanish for logs
        this.addDomainEvent(new EnterpriseUpdatedEvent(this.id));
        console.log('✅ Información de contacto actualizada');
    }
}
```

#### Value Objects
```typescript
// Value objects with domain validation
class TaxId {
    constructor(private readonly value: string) {
        this.validate();
    }

    private validate(): void {
        if (!this.isValid(this.value)) {
            // Error message in Spanish for end users
            throw new DomainException('El RUC ingresado no es válido');
        }
    }
}
```

#### Domain Events
```typescript
// Event interfaces in English
interface EnterpriseCreatedEvent {
    id: string;
    timestamp: string;
    eventType: 'EnterpriseCreated';
    detail: {
        id: string;
        taxId: string;
        legalBusinessName: string;
        enterpriseType: string;
        contactEmail: string;
    };
}

// Event handler with Spanish logs
class EnterpriseCreatedHandler {
    async handle(event: EnterpriseCreatedEvent): Promise<void> {
        console.log('📦 Procesando evento de creación de empresa');
        // Implementation
        console.log('✅ Evento procesado exitosamente');
    }
}
```

### CQRS Implementation

#### Commands
```typescript
// Commands in English
interface CreateEnterpriseCommand {
    taxId: string;
    legalBusinessName: string;
    enterpriseType: string;
    contactEmail: string;
    contactPhone?: string;
}

// Handler with Spanish logs
class CreateEnterpriseHandler {
    async execute(command: CreateEnterpriseCommand): Promise<void> {
        console.log('📝 Creando nueva empresa...');
        // Implementation
        console.log('✅ Empresa creada exitosamente');
    }
}
```

#### Queries
```typescript
// Queries in English
interface GetEnterpriseQuery {
    id: string;
}

// Handler with Spanish logs
class GetEnterpriseHandler {
    async execute(query: GetEnterpriseQuery): Promise<EnterpriseDTO> {
        console.log(`🔍 Buscando empresa ${query.id}...`);
        // Implementation
        console.log('✅ Empresa encontrada');
    }
}
```

## AWS Infrastructure

### Event Processing
1. **EventBridge**
   ```typescript
   // Event publication in English
   await eventBridge.putEvents({
       Entries: [{
           EventBusName: 'sistema-bancario-events',
           Source: 'sistema-bancario.enterprises',
           DetailType: 'EnterpriseCreated',
           Detail: JSON.stringify(event)
       }]
   });
   // Logs in Spanish
   console.log('✅ Evento publicado en EventBridge');
   ```

2. **Lambda**
   ```typescript
   // Lambda handler in English
   export const handler = async (event: any): Promise<any> => {
       // Logs in Spanish
       console.log('📥 Evento recibido:', JSON.stringify(event));
       try {
           // Processing
           console.log('✅ Evento procesado exitosamente');
       } catch (error) {
           console.error('❌ Error al procesar evento:', error);
           throw error;
       }
   };
   ```

3. **DynamoDB**
   ```typescript
   // DynamoDB operations in English
   await dynamodb.put({
       TableName: 'sistema-bancario-auditoria',
       Item: {
           id: event.id,
           timestamp: event.timestamp,
           eventType: event.detailType,
           detail: event.detail
       }
   });
   // Logs in Spanish
   console.log('💾 Evento guardado en DynamoDB');
   ```

### Authentication
1. **Cognito**
   ```typescript
   // Cognito integration in English
   const authConfig = {
       userPoolId: 'us-east-1_g5urRrRvg',
       clientId: '2qg67m083md62on495ptt3okqs'
   };

   // Error messages in Spanish
   try {
       await cognito.signUp(params);
       console.log('✅ Usuario registrado exitosamente');
   } catch (error) {
       console.error('❌ Error al registrar usuario:', error);
       throw new AuthenticationError('Error al crear el usuario');
   }
   ```

### API Gateway
```typescript
// API documentation in English
@ApiOperation({ summary: 'Create new enterprise' })
@ApiResponse({ status: 201, description: 'Enterprise created successfully' })
async createEnterprise(@Body() dto: CreateEnterpriseDTO): Promise<void> {
    // Implementation with Spanish logs
    console.log('📝 Procesando solicitud de creación de empresa');
}
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow SOLID principles
- Implement proper error handling
- Write comprehensive unit tests

### Naming Conventions
- Code, classes, methods in English
- User messages and logs in Spanish
- Use PascalCase for classes
- Use camelCase for methods

### Error Handling
```typescript
// Error classes in English
class DomainException extends Error {
    constructor(message: string) {
        // Message in Spanish for end users
        super(message);
        this.name = 'DomainException';
    }
}

// Usage example
throw new DomainException('El RUC ingresado no es válido');
```

### Testing
```typescript
// Test descriptions in English
describe('EnterpriseAggregate', () => {
    it('should create valid enterprise', () => {
        const enterprise = new EnterpriseAggregate(
            'test-id',
            new TaxId('PE12345678901'),
            'Test Enterprise',
            EnterpriseType.SRL,
            new Email('test@example.com')
        );

        expect(enterprise).toBeDefined();
        // Console messages in Spanish
        console.log('✅ Prueba completada exitosamente');
    });
});
```

## API Documentation

### Endpoints

#### Create Enterprise
```typescript
@Post('/enterprises')
@ApiOperation({ summary: 'Create a new enterprise' })
@ApiResponse({ 
    status: 201, 
    description: 'Enterprise created successfully',
    // Error messages in Spanish
    schema: { 
        example: { 
            message: 'Empresa creada exitosamente',
            id: 'emp-123' 
        }
    }
})
async createEnterprise(@Body() dto: CreateEnterpriseDTO): Promise<void> {
    // Implementation
}
```

### DTOs
```typescript
// DTOs in English with Spanish validation messages
export class CreateEnterpriseDTO {
    @ApiProperty()
    @IsString({ message: 'El RUC debe ser una cadena de texto' })
    taxId: string;

    @ApiProperty()
    @IsString({ message: 'La razón social debe ser una cadena de texto' })
    legalBusinessName: string;

    @ApiProperty()
    @IsEnum(EnterpriseType, { 
        message: 'El tipo de empresa debe ser válido' 
    })
    enterpriseType: string;

    @ApiProperty()
    @IsEmail({}, { 
        message: 'El correo electrónico no es válido' 
    })
    contactEmail: string;
}
```

## Deployment

### Infrastructure as Code
```hcl
# Terraform resources in English
resource "aws_lambda_function" "event_processor" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "sistema-bancario-event-processor"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs16.x"
  
  environment {
    variables = {
      // Environment variables in English
      DYNAMODB_TABLE = "sistema-bancario-auditoria"
      EVENT_BUS     = "sistema-bancario-events"
    }
  }
}
```

## Monitoring and Logging

### CloudWatch Logs
```typescript
// Logging in Spanish for better diagnostics
const logger = new Logger('EnterpriseService');
logger.log('🚀 Iniciando servicio de empresas');
logger.error('❌ Error al procesar solicitud');
logger.warn('⚠️ Advertencia: datos incompletos');
```

### Custom Metrics
```typescript
// Metrics in English, descriptions in Spanish
const metrics = new AWS.CloudWatch();
await metrics.putMetricData({
    MetricData: [{
        MetricName: 'EnterpriseCreated',
        Value: 1,
        Unit: 'Count',
        // Spanish description for CloudWatch dashboard
        Dimensions: [{
            Name: 'Tipo',
            Value: 'Creación de Empresa'
        }]
    }],
    Namespace: 'BankingSystem'
}).promise();
```
