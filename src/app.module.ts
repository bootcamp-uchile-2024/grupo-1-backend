import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { DespachosModule } from './despachos/despachos.module';
import { VentasModule } from './ventas/ventas.module';
import { EquipoModule } from './equipo/equipo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalMiddlewareMiddleware } from './comunes/middleware/global.middleware.middleware';

@Module({
  imports: [
    UsuariosModule,
    ProductosModule,
    DespachosModule,
    VentasModule,
    EquipoModule,
    // Configuración global de .env según el entorno (producción/desarrollo)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.AMBIENTE === 'desarrollo'
          ? '.env.productivo'
          : '.env.develop',
    }),
    // Conexión a la base de datos

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'asdf1016',
      database: 'plantopiadb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Sincroniza el esquema de la base de datos
      logging: true, // Habilita el registro de consultas SQL
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GlobalMiddlewareMiddleware) // Middleware global
      .forRoutes('*'); // Aplica a todas las rutas
  }
}
