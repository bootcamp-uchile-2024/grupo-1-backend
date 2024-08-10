import { Module } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';

@Module({
  providers: [EquipoService],
  controllers: [EquipoController]
})
export class EquipoModule {}
