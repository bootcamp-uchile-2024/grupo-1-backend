import { Module } from '@nestjs/common';
import { UsuariosController } from './controller/usuarios.controller';
import { UsuariosService } from './service/usuarios.service';
import { ProductosModule } from 'src/productos/productos.module';
@Module({
  imports: [ProductosModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
