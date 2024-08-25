import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentasModule } from './ventas/ventas.module';
import { ProductosModule } from './productos/productos.module';
import { DespachosModule } from './despachos/despachos.module';
import { ComprasModule } from './compras/compras.module';
import { EquipoModule } from './equipo/equipo.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger para la aplicación principal
  const config = new DocumentBuilder()
    .setTitle('API Plantopia APP')
    .setDescription('Esta es la documentación de la API de la APP Plantopia')
    .setVersion('1.0')
    .addTag('app-plantopia')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  // Configuración de Swagger para el módulo de usuarios
  const usuariosApp = await NestFactory.create(UsuariosModule);
  const configUsers = new DocumentBuilder()
    .setTitle('API Plantopia APP - Módulo Usuarios')
    .setDescription(
      'Documentación de la API de la APP Plantopia para el módulo de Usuarios',
    )
    .setVersion('1.0')
    .addTag('app-plantopia-usuarios')
    .build();
  const documentUsers = SwaggerModule.createDocument(usuariosApp, configUsers);
  SwaggerModule.setup('api/usuarios', usuariosApp, documentUsers, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  // Configuración de Swagger para el módulo de ventas
  const ventasApp = await NestFactory.create(VentasModule);
  const configVentas = new DocumentBuilder()
    .setTitle('API Plantopia APP - Módulo Ventas')
    .setDescription(
      'Documentación de la API de la APP Plantopia para el módulo de Ventas',
    )
    .setVersion('1.0')
    .addTag('app-plantopia-ventas')
    .build();
  const documentVentas = SwaggerModule.createDocument(ventasApp, configVentas);
  SwaggerModule.setup('api/ventas', ventasApp, documentVentas, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  // Configuración de Swagger para el módulo de productos
  const productosApp = await NestFactory.create(ProductosModule);
  const configProductos = new DocumentBuilder()
    .setTitle('API Plantopia APP - Módulo Productos')
    .setDescription(
      'Documentación de la API de la APP Plantopia para el módulo de Productos',
    )
    .setVersion('1.0')
    .addTag('app-plantopia-productos')
    .build();
  const documentProductos = SwaggerModule.createDocument(
    productosApp,
    configProductos,
  );
  SwaggerModule.setup('api/productos', productosApp, documentProductos, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  // Configuración de Swagger para el módulo de despachos
  const despachosApp = await NestFactory.create(DespachosModule);
  const configDespachos = new DocumentBuilder()
    .setTitle('API Plantopia APP - Módulo Despachos')
    .setDescription(
      'Documentación de la API de la APP Plantopia para el módulo de Despachos',
    )
    .setVersion('1.0')
    .addTag('app-plantopia-despachos')
    .build();
  const documentDespachos = SwaggerModule.createDocument(
    despachosApp,
    configDespachos,
  );
  SwaggerModule.setup('api/despachos', despachosApp, documentDespachos, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  // Configuración de Swagger para el módulo de compras
  const comprasApp = await NestFactory.create(ComprasModule);
  const configCompras = new DocumentBuilder()
    .setTitle('API Plantopia APP - Módulo Compras')
    .setDescription(
      'Documentación de la API de la APP Plantopia para el módulo de Compras',
    )
    .setVersion('1.0')
    .addTag('app-plantopia-compras')
    .build();
  const documentCompras = SwaggerModule.createDocument(
    comprasApp,
    configCompras,
  );
  SwaggerModule.setup('api/compras', comprasApp, documentCompras, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  // Configuración de Swagger para el módulo de equipos
  const equiposApp = await NestFactory.create(EquipoModule);
  const configEquipos = new DocumentBuilder()
    .setTitle('API Plantopia APP - Módulo Equipos')
    .setDescription(
      'Documentación de la API de la APP Plantopia para el módulo de Equipos',
    )
    .setVersion('1.0')
    .addTag('app-plantopia-equipos')
    .build();
  const documentEquipos = SwaggerModule.createDocument(
    equiposApp,
    configEquipos,
  );
  SwaggerModule.setup('api/equipos', equiposApp, documentEquipos, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  await app.listen(3000);
}
bootstrap();
