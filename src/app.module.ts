import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DespachosModule } from './despachos/despachos.module';
import { ProductosModule } from './productos/productos.module';
//import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [UsuariosModule, ProductosModule, DespachosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
