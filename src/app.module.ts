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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express/multer';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './comunes/filter/http-exception.filter';
import { LoggingInterceptor } from './comunes/interceptor/loggin.interceptor';
import { LoggingMiddleware } from './comunes/middleware/loggin.middleware';

@Module({
  imports: [
    UsuariosModule,
    ProductosModule,
    DespachosModule,
    VentasModule,
    EquipoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.AMBIENTE === 'production' ? '.env.productivo' : '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: '/uploads',
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      autoLoadEntities: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
    }),
    MulterModule.register({
      dest: './uploads',
      limits: { fileSize: 10 * 1024 * 1024 }, // Limitar el tamaño del archivo a 10MB
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, GlobalMiddlewareMiddleware) // Middleware global
      .forRoutes('*'); // Aplica a todas las rutas
  }
}
