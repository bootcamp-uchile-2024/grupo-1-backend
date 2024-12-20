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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express/multer';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './comunes/filter/http-exception.filter';
import { LoggingInterceptor } from './comunes/interceptor/loggin.interceptor';
import { LoggingMiddleware } from './comunes/middleware/loggin.middleware';
import { JwtModule } from '@nestjs/jwt';

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
      host: 'localhost',
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: ['warn', 'error'],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secretKey = process.env.JWT_SECRET
        console.log('JWT_SECRET desde ConfigService:', secretKey);  // Asegúrate de que se esté imprimiendo
        return {
          secret: secretKey,
          signOptions: { expiresIn: '1h' },
        };
      },
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
