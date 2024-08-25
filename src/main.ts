import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsuariosModule } from './usuarios/usuarios.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usuariosdoc = await NestFactory.create(UsuariosModule);
  // Configuracion de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Plantopia APP')
    .setDescription('Esta es la documentación de la API de la APP Plantopia')
    .setVersion('1.0')
    .addTag('app-plantopia')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const configUsers = new DocumentBuilder()
    .setTitle('API Plantopia APP - Modulo Usuarios')
    .setDescription(
      'Esta es la documentación de la API de la APP Plantopia para modulo de Usuarios',
    )
    .setVersion('1.0')
    .addTag('app-plantopia-usuarios')
    .build();
  const documentUsers = SwaggerModule.createDocument(usuariosdoc, configUsers);

  SwaggerModule.setup('api', app, document, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/usuarios', usuariosdoc, documentUsers, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  await app.listen(3000);
}
bootstrap();
