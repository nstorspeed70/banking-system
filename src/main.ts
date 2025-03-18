import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './interface/api/filters/http-exception.filter';
import { TransformInterceptor } from './interface/api/interceptors/transform.interceptor';

async function bootstrap() {
  // Configurar nivel de logs
  const logger = new Logger('Sistema Bancario');
  logger.log('Iniciando aplicación...');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Configurar interceptores y filtros globales
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar CORS
  app.enableCors();

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Banking System API')
    .setDescription('API for banking system management')
    .setVersion('1.0')
    .addTag('Enterprises')
    .addTag('Parties')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.log('Aplicación iniciada exitosamente');
  await app.listen(3000);
}
bootstrap();