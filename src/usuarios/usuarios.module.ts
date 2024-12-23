import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuariosController } from './controller/usuarios.controller';
import { UsuariosService } from './service/usuarios.service';
import { Comuna } from 'src/localizaciones/entities/comuna.entity';
import { Perfil } from './entities/perfil.entity';
import { JardinVirtual } from './entities/jardin_virtual.entity';
import { DetalleJardinVirtual } from './entities/detalle_jardin_virtual.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Comuna,
      Perfil,
      JardinVirtual,
      DetalleJardinVirtual,
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
