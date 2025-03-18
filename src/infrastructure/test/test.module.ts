import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { awsConfig } from '../config/aws.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: awsConfig.database.host,
      port: awsConfig.database.port,
      username: awsConfig.database.username,
      password: process.env.DB_PASSWORD,
      database: awsConfig.database.database,
      entities: [],
      synchronize: false, // Importante: false en producción
    }),
  ],
})
export class TestModule {}
