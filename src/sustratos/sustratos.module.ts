import { Module } from '@nestjs/common';
import { SustratosController } from './controller/sustratos.controller';
import { SustratosService } from './service/sustratos.service';

@Module({
  controllers: [SustratosController],
  providers: [SustratosService],
})
export class SustratosModule {}
