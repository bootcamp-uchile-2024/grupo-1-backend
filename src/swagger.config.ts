import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as packageJson from '../package.json';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentasModule } from './ventas/ventas.module';
import { DespachosModule } from './despachos/despachos.module';

export function createSwaggerConfig(moduleName: string, ambiente: string) {
  const title = `${packageJson.name} - ${moduleName} (${ambiente})`;
  const contacts = packageJson.contributors
    .map((contributor) => `${contributor.name} (${contributor.email})`)
    .join('\n');
  return new DocumentBuilder()
    .setTitle(title)
    .setDescription(`${packageJson.description}\n\n**Contactos:**\n${contacts}`)
    .setVersion(packageJson.version)
    .setContact(packageJson.author, '', '')
    .setLicense(packageJson.license, '')
    .addBearerAuth()
    .build();
}

export function setupSwagger(app: INestApplication, ambiente: string) {
  const document = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('App', ambiente),
    {
      include: [ProductosModule, UsuariosModule, VentasModule, DespachosModule],
    },
  );
  const productos = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Productos', ambiente),
    {
      include: [ProductosModule],
    },
  );
  const usuarioSwagger = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Usuarios', ambiente),
    {
      include: [UsuariosModule],
    },
  );
  const ventasSwagger = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Ventas', ambiente),
    {
      include: [VentasModule],
    },
  );
  const despachoSwagger = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Despachos', ambiente),
    {
      include: [DespachosModule],
    },
  );

  SwaggerModule.setup('api/productos', app, productos, {
    yamlDocumentUrl: 'swagger/yaml',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  SwaggerModule.setup('api/despachos', app, despachoSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  SwaggerModule.setup('api', app, document, {
    yamlDocumentUrl: 'swagger/yaml',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  SwaggerModule.setup('api/usuarios', app, usuarioSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  SwaggerModule.setup('api/ventas', app, ventasSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
