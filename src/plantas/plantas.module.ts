import { Module } from '@nestjs/common';
import { PlantasService } from './plantas.service';
import { PlantasController } from './plantas.controller';

@Module({
  controllers: [PlantasController],
  providers: [PlantasService],
})
export class PlantasModule {}
