import { Module } from '@nestjs/common';
import { ProductosController } from './controller/productos.controller';
import { ProductosService } from './service/productos.service';
import { SustratosService } from './service/sustratos.service';
import { PlantasService } from './service/plantas.service';
import { MaceterosService } from './service/maceteros.service';
import { FertilizantesService } from './service/fertilizantes.service';
import { ControlPlagasService } from './service/control-plagas.service';
@Module({
  controllers: [ProductosController],
  providers: [ProductosService,SustratosService,PlantasService,MaceterosService,FertilizantesService,ControlPlagasService],
  exports: [ProductosService,SustratosService,PlantasService,MaceterosService,FertilizantesService,ControlPlagasService],
})
export class ProductosModule { }