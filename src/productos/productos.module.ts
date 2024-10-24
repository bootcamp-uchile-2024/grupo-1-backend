import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './controller/productos.controller';
import { ProductosService } from './service/productos.service';
import { SustratosService } from './service/sustratos.service';
import { PlantasService } from './service/plantas.service';
import { MaceterosService } from './service/maceteros.service';
import { FertilizantesService } from './service/fertilizantes.service';
import { ControlPlagasService } from './service/control-plagas.service';
import { Producto } from 'entitychr/producto-entity';
import { Sustrato } from 'entitychr/sustrato-entity';
import { Planta } from 'entitychr/planta-entity';
import { Macetero } from 'entitychr/macetero-entity';
import { Fertilizante } from 'entitychr/fertilizante-entity';
import { ControlPlagas } from 'entitychr/controlplagas-entity';
import { Categoria } from 'entitychr/categoria-entity';
import { Servicio } from 'entitychr/servicio-entity';
import { CoberturaDespachoProducto } from 'entitychr/CoberturaDespachoProducto-entity';
import { ImagenProducto } from 'entitychr/imagen-entity';
import { DetalleOrdenCompra } from 'entitychr/DetalleOrdenCompra-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      Sustrato,
      Planta,
      Macetero,
      Fertilizante,
      ControlPlagas,
      Categoria,
      Servicio,
      CoberturaDespachoProducto,
      ImagenProducto,
      DetalleOrdenCompra,
    ]),
  ],
  controllers: [ProductosController],
  providers: [
    ProductosService,
    SustratosService,
    PlantasService,
    MaceterosService,
    FertilizantesService,
    ControlPlagasService,
  ],
  exports: [
    ProductosService,
    SustratosService,
    PlantasService,
    MaceterosService,
    FertilizantesService,
    ControlPlagasService,
  ],
})
export class ProductosModule {}
