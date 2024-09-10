import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PlantasModule } from 'src/plantas/plantas.module';
=======
import { UsuariosController } from './controller/usuarios.controller';
import { UsuariosService } from './service/usuarios.service';
>>>>>>> main

@Module({
  imports:[PlantasModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  

})
export class UsuariosModule {}
