import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnterpriseModule } from './modules/enterprise/enterprise.module';
import { RepositoryModule } from './infrastructure/repositories/repository.module';
import { EventsModule } from './infrastructure/events/events.module';
import { ApiModule } from './interface/api/api.module';
import { EnterpriseEntity } from './infrastructure/entities/enterprise.entity';
import { PartyEntity } from './infrastructure/entities/party.entity';
import { typeOrmConfig } from './infrastructure/config/typeorm.config';

/**
 * Main application module
 * Configures global dependencies and imports feature modules
 */
@Module({
  imports: [
    // Core modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        () => ({
          aws: {
            region: process.env.AWS_REGION || 'us-east-1',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN,
            eventBusName: process.env.EVENT_BUS_NAME || 'sistema-bancario-events',
            dynamodbTable: process.env.DYNAMODB_TABLE || 'sistema-bancario-auditoria',
          },
          database: {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            name: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
          },
          cognito: {
            userPoolId: process.env.COGNITO_USER_POOL_ID,
            clientId: process.env.COGNITO_CLIENT_ID,
            callbackUrl: process.env.COGNITO_CALLBACK_URL,
            logoutUrl: process.env.COGNITO_LOGOUT_URL,
          },
        }),
      ],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    CqrsModule,
    EventsModule,

    // Feature modules
    EnterpriseModule,
    RepositoryModule,
    ApiModule,
  ],
})
export class AppModule {}
