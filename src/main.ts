import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LogRespuestasInterceptor } from './comunes/interceptor/log-respuestas/log-respuestas.interceptor';
import { GlobalFilter } from './comunes/filter/global.filter';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { setupSwagger } from './swagger.config';
import rateLimit from 'express-rate-limit';
import * as https from 'https';

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
      message: 'Demasiadas solicitudes, por favor intenta más tarde',
    }),
  );
  app.useGlobalInterceptors(new LogRespuestasInterceptor());

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

  // Configuración HTTPS para ambiente de desarrollo
  if (ambiente === 'desarrollo') {
    try {
      // Usar la ruta base del proyecto
      const projectRoot = process.cwd();
      const certificadosPath = resolve(projectRoot, 'certificados');

      Logger.log(`Intentando cargar certificados desde: ${certificadosPath}`);

      const httpsOptions = {
        key: fs.readFileSync(`${certificadosPath}/localhost.key`),
        cert: fs.readFileSync(`${certificadosPath}/localhost.crt`),
      };

      Logger.log('Certificados cargados correctamente');

      const server = https.createServer(
        httpsOptions,
        app.getHttpAdapter().getInstance(),
      );

      await app.init();
      server.listen(puerto, () => {
        Logger.log(
          `🔐 Aplicación HTTPS escuchando en puerto ${puerto}, en ambiente de ${ambiente} con version: ${version}`,
        );
      });
    } catch (error) {
      Logger.error(`Error al cargar los certificados SSL: ${error.message}`);
      Logger.warn(`Directorio actual: ${process.cwd()}`);
      Logger.warn(`Contenido del directorio:`);
      try {
        const files = fs.readdirSync(process.cwd());
        Logger.warn(files);
      } catch (e) {
        Logger.error(`Error al listar directorio: ${e.message}`);
      }

      Logger.error('Iniciando servidor sin SSL...');

      await app.listen(puerto);
      Logger.log(
        `Aplicación HTTP escuchando en puerto ${puerto}, en ambiente de ${ambiente} con version: ${version}`,
      );
    }
  } else {
    // Configuración normal para otros ambientes
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
}
bootstrap();
