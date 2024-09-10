import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PlantasModule } from 'src/plantas/plantas.module';

@Module({
  imports:[PlantasModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  

})
export class UsuariosModule {}
