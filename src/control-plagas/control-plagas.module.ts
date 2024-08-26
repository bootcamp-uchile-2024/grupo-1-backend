import { Module } from '@nestjs/common';
import { ControlPlagasService } from './control-plagas.service';
import { ControlPlagasController } from './control-plagas.controller';

@Module({
  controllers: [ControlPlagasController],
  providers: [ControlPlagasService],
})
export class ControlPlagasModule {}