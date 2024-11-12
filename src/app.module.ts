import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        process.env.AMBIENTE === 'production'
          ? '.env.productivo'
          : '.env.develop',
    }),
    // Conexión a la base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        //       synchronize: process.env.AMBIENTE !== 'produccion', // No sincronizar en producción
        synchronize: false, // No sincronizar en producción
        logging: true,
      }),
      inject: [ConfigService],
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
