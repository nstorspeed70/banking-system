import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EnterpriseModule } from './controllers/enterprise/enterprise.module';
import { PartyModule } from './controllers/party/party.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

/**
 * Mu00f3dulo principal de la API
 */
@Module({
  imports: [EnterpriseModule, PartyModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ApiModule {}
