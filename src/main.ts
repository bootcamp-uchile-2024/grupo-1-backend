import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentasModule } from './ventas/ventas.module';
import { ProductosModule } from './productos/productos.module';
import { DespachosModule } from './despachos/despachos.module';
import { EquipoModule } from './equipo/equipo.module';
import { PlantasModule } from './plantas/plantas.module';
import { FertilizantesModule } from './fertilizantes/fertilizantes.module';
import { SustratosModule } from './sustratos/sustratos.module';
import { ControlPlagasModule } from './control-plagas/control-plagas.module';
import { OrdenComprasModule } from './orden-compras/orden-compras.module';

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
    //documentacion plantas
    
    const plantasSwagger = SwaggerModule.createDocument(app, config, {
      include: [PlantasModule],
    });
    //documentacion fertilizantes
    const fertilizantesSwagger = SwaggerModule.createDocument(app, config, {
      include: [FertilizantesModule],
    });
    //documentacion sustratos
    const sustratosSwagger = SwaggerModule.createDocument(app, config, {
      include: [SustratosModule],
    });    
    //documentacion controlPlagas
    const controlPlagasSwagger = SwaggerModule.createDocument(app, config, {
      include: [ControlPlagasModule],
    });    
  //documentacion usuario
  const usuarioSwagger = SwaggerModule.createDocument(app, config, {
    include: [UsuariosModule],
  });
//documentacion OC
const ocSwagger = SwaggerModule.createDocument(app, config, {
  include: [OrdenComprasModule],
});
//documentacion OC
const despachoSwagger = SwaggerModule.createDocument(app, config, {
  include: [DespachosModule],
});
/*
  //documentacion ventas
  const ventasSwagger = SwaggerModule.createDocument(app, config, {
    include: [VentasModule],
  });
  //documentacion despachos
  const despachosSwagger = SwaggerModule.createDocument(app, config, {
    include: [DespachosModule],
  });
  //documentacion compras
  const comprasSwagger = SwaggerModule.createDocument(app, config, {
    include: [ComprasModule],
  });*/

  SwaggerModule.setup('api/plantas', app, plantasSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/fertilizantes', app, fertilizantesSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/sustratos', app, sustratosSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/controlPlagas', app, controlPlagasSwagger, {
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
  SwaggerModule.setup('api/ordenCompra', app, ocSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
 /* SwaggerModule.setup('api/ventas', app, ventasSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  SwaggerModule.setup('api/despachos', app, despachosSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  SwaggerModule.setup('api/compras', app, comprasSwagger, {
    yamlDocumentUrl: 'swagger/yaml',
  });*/
  await app.listen(3000);
}
bootstrap();

