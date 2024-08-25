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
  const document = SwaggerModule.createDocument(app, config, {
    include: [AppModule],
  });
  //documentacion usuario
  const usuarioSwagger = SwaggerModule.createDocument(app, config, {
    include: [UsuariosModule],
  });
  //documentacion ventas
  const ventasSwagger = SwaggerModule.createDocument(app, config, {
    include: [VentasModule],
  });
  //documentacion productos
  const productosSwagger = SwaggerModule.createDocument(app, config, {
    include: [ProductosModule],
  });
  //documentacion despachos
  const despachosSwagger = SwaggerModule.createDocument(app, config, {
    include: [DespachosModule],
  });
  //documentacion compras
  const comprasSwagger = SwaggerModule.createDocument(app, config, {
    include: [ComprasModule],
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
  SwaggerModule.setup('api/productos', app, productosSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/despachos', app, despachosSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/compras', app, comprasSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  await app.listen(3000);
}
bootstrap();
