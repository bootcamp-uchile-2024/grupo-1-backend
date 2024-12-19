import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LogRespuestasInterceptor } from './comunes/interceptor/log-respuestas/log-respuestas.interceptor';
import { GlobalFilter } from './comunes/filter/global.filter';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { LoggingInterceptor } from './comunes/interceptor/loggin.interceptor';
import { setupSwagger } from './swagger.config';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const puerto = configService.get<number>('PUERTO');
  const ambiente = configService.get<string>('AMBIENTE');
  const version = configService.get<string>('VERSION');
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  app.useGlobalInterceptors(new LogRespuestasInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());

  setupSwagger(app, ambiente);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalFilter());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const uploadsPath = resolve(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));

  await app.listen(puerto);
  Logger.log(
    'Aplicación escuchando en ' +
      puerto +
      ' ,en ambiente de ' +
      ambiente +
      ' con version: ' +
      version,
  );
}
bootstrap();
