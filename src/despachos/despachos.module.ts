import { Module } from '@nestjs/common';
import { DespachosController } from './controller/despachos.controller';
import { DespachosService } from './service/despachos.service';
import { EstadosDespacho } from './entities/estados_despacho.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despacho } from './entities/despacho.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Despacho, EstadosDespacho])],
  controllers: [DespachosController],
  providers: [DespachosService],
})
export class DespachosModule {}
