import { Module } from '@nestjs/common';
import { FertilizantesService } from './fertilizantes.service';
import { FertilizantesController } from './fertilizantes.controller';

@Module({
  controllers: [FertilizantesController],
  providers: [FertilizantesService],
})
export class FertilizantesModule {}
