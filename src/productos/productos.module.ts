import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Planta } from './entities/planta.entity';
import { Habitat } from './entities/habitat.entity';
import { LuzRequerida } from './entities/luz_requerida.entity';
import { NivelDeHumedad } from './entities/nivel_de_humedad.entity';
import { DificultadDeCuidado } from './entities/dificultad_de_cuidado.entity';
import { FrecuenciaDeRiego } from './entities/frecuencia_de_riego.entity';
import { Fertilizante } from './entities/fertilizante.entity';
import { Sustrato } from './entities/sustrato.entity';
import { Estacion } from './entities/estacion.entity';
import { TipoDeSuelo } from './entities/tipo_de_suelo.entity';
import { ProductosController } from './controller/productos.controller';
import { ProductosService } from './service/productos.service';
import { Categoria } from './entities/categoria.entity';
import { ImagenProducto } from './entities/imagen_producto.entity';
import { Macetero } from './entities/macetero.entity';
import * as path from 'path';
import { PlantaService } from './service/subservice/plantas.service';
import { MaceterosService } from './service/subservice/maceteros.service';
import { FertilizantesService } from './service/subservice/fertilizantes.service';
import { SustratosService } from './service/subservice/sustratos.service';
import { FiltrosService } from './service/subservice/filtros.service';
import { CategoriasService } from './service/subservice/categorias.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      Planta,
      Habitat,
      LuzRequerida,
      NivelDeHumedad,
      DificultadDeCuidado,
      FrecuenciaDeRiego,
      Fertilizante,
      Sustrato,
      Estacion,
      TipoDeSuelo,
      Categoria,
      ImagenProducto,
      Macetero,
    ]),
  ],
  controllers: [ProductosController],
  providers: [
    ProductosService,
    PlantaService,
    MaceterosService,
    FertilizantesService,
    SustratosService,
    FiltrosService,
    CategoriasService,
    JwtService,
    {
      provide: 'IMAGE_PATH', // Un token para identificar el valor
      useValue: path.join(__dirname, '..', 'public', 'images'),
    },
  ],
  exports: [TypeOrmModule, ProductosService], // Exporta el ProductosService
})
export class ProductosModule {}
