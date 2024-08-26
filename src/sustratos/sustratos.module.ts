import { Module } from '@nestjs/common';
import { SustratosService } from './sustratos.service';
import { SustratosController } from './sustratos.controller';

@Module({
  controllers: [SustratosController],
  providers: [SustratosService],
})
export class SustratosModule {}
