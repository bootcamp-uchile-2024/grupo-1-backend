import { Module } from '@nestjs/common';
import { PlantaCuidadosService } from './planta-cuidados.service';
import { PlantaCuidadosController } from './planta-cuidados.controller';

@Module({
  controllers: [PlantaCuidadosController],
  providers: [PlantaCuidadosService],
})
export class PlantaCuidadosModule {}
