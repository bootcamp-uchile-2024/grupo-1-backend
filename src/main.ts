import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { DespachosModule } from './despachos/despachos.module';
import { ValidationPipe } from '@nestjs/common';
import { LogRespuestasInterceptor } from './comunes/interceptor/log-respuestas/log-respuestas.interceptor';
import { GlobalFilter } from './comunes/filter/global.filter';
import * as packageJson from '../package.json';
import { ConfigService } from '@nestjs/config';
import { VentasModule } from './ventas/ventas.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const puerto = configService.get<number>('PUERTO');
  const ambiente = configService.get<string>('AMBIENTE');
  const version = configService.get<string>('VERSION');
  app.enableCors();
  app.useGlobalInterceptors(new LogRespuestasInterceptor());
  const createSwaggerConfig = (moduleName: string) => {
    const title = `${packageJson.name} - ${moduleName} (${ambiente})`;
    const contacts = packageJson.contributors
      .map((contributor) => `${contributor.name} (${contributor.email})`)
      .join('\n');
    return new DocumentBuilder()
      .setTitle(title)
      .setDescription(
        `${packageJson.description}\n\n**Contactos:**\n${contacts}`,
      )
      .setVersion(packageJson.version)
      .setContact(packageJson.author, '', '')
      .setLicense(packageJson.license, '')
      .build();
  };
  const document = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('App'),
    {
      include: [ProductosModule, UsuariosModule, VentasModule, DespachosModule],
    },
  );
  const productos = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Productos'),
    {
      include: [ProductosModule],
    },
  );
  const usuarioSwagger = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Usuarios'),
    {
      include: [UsuariosModule],
    },
  );
  const ventasSwagger = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Ventas'),
    {
      include: [VentasModule],
    },
  );
  const despachoSwagger = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Despachos'),
    {
      include: [DespachosModule],
    },
  );
  SwaggerModule.setup('api/productos', app, productos, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  SwaggerModule.setup('api/despachos', app, despachoSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  SwaggerModule.setup('api', app, document, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/usuarios', app, usuarioSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/ventas', app, ventasSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalFilter());
  await app.listen(puerto);
  console.log(
    'Aplicación escuchando en http://localhost:' +
      puerto +
      ' ,en ambiente de ' +
      ambiente +
      ' con version: ' +
      version,
  );

  console.log(process.env.DB_PORT);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_USERNAME);
  console.log(process.env.DB_PASSWORD);
  console.log(process.env.DB_DATABASE);
}
bootstrap();
