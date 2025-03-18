import { Module } from '@nestjs/common';
import { CognitoService } from './auth/cognito.service';
import { EventBridgeService } from './events/event-bridge.service';
import { DynamoDBService } from './audit/dynamodb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { awsConfig } from './config/aws.config';

/**
 * Infrastructure Module
 * Centralizes all AWS infrastructure services and database connections
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: awsConfig.database.host,
      port: awsConfig.database.port,
      username: awsConfig.database.username,
      password: process.env.DB_PASSWORD,
      database: awsConfig.database.database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production',
    }),
  ],
  providers: [
    CognitoService,
    EventBridgeService,
    DynamoDBService,
  ],
  exports: [
    CognitoService,
    EventBridgeService,
    DynamoDBService,
  ],
})
export class InfrastructureModule {}
