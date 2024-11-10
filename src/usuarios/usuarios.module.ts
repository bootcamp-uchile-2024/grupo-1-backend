import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuariosController } from './controller/usuarios.controller';
import { UsuariosService } from './service/usuarios.service';
import { Comuna } from 'src/localizaciones/entities/comuna.entity';
import { Perfil } from './entities/perfil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Comuna, Perfil])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
