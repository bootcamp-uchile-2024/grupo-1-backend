import { Injectable } from '@nestjs/common';
import { CreateMaceteroDto } from 'src/maceteros/dto/create-macetero.dto';
import { CreatePlantaDto } from 'src/plantas/dto/create-planta.dto';
import { CreateControlPlagasDto } from 'src/control-plagas/dto/create-control-plagas.dto';

import { ErrorPlantopia } from 'src/comunes/error-plantopia/error-plantopia';
import { Producto } from '../entities/producto.entity';
import { TipoProductos } from '../entities/enum-productos';
import { MaceterosService } from 'src/maceteros/service/maceteros.service';

import { CreateFertilizanteDto } from 'src/fertilizantes/dto/create-fertilizante.dto';

import { CreateSustratoDto } from 'src/sustratos/dto/create-sustrato.dto';
import { SustratosService } from 'src/sustratos/service/sustratos.service';
import { createReadStream } from 'fs';
import { TexturaSustrato } from 'src/sustratos/entities/enum-sustratos';
import { create } from 'domain';
import { ControlPlagasService } from 'src/control-plagas/service/control-plagas.service';
import { FertilizantesService } from 'src/fertilizantes/service/fertilizantes.service';
import { PlantasService } from 'src/plantas/service/plantas.service';

@Injectable()
export class ProductosService {
  productos: Producto[] = [];
  constructor(
    private readonly servicioMaceteros: MaceterosService,
    private readonly servicioPLantas: PlantasService,
    private readonly servicioControlPlagas: ControlPlagasService,
    private readonly servicioFertilizantes: FertilizantesService,
    private readonly servicioSustratos: SustratosService,
  ) {
    this.productos = [
      new Producto(  1, 'macetero rojo', ['http://lugar.com/imagen_m1.png'], 0,1500, ['Arica a Pta.Arenas'],  10, 'macetero de alta gama', TipoProductos.Macetero,  0, 0, 'MA1' ),
      new Producto(  2, 'macetero blanco', ['http://lugar.com/imagen_m2.png'], 0, 2500,['Arica a Pta.Arenas'], 10, 'macetero interior',  TipoProductos.Macetero, 0,500, 'MA2' ),
      new Producto(  3, 'macetero verde', ['http://lugar.com/imagen_m1.png'],  0, 1500, ['Arica a Pta.Arenas'], 10, 'macetero de alta gama', TipoProductos.Macetero, 0, 500,'MA3' ),
      new Producto(  4, 'macetero azul', ['http://lugar.com/imagen_m2.png'],  0, 2500, ['Arica a Pta.Arenas'], 10, 'macetero interior', TipoProductos.Macetero, 0, 0,'MA4' ),
      new Producto(  5, 'macetero amarillo', ['http://lugar.com/imagen_m1.png'], 0, 1500, ['Arica a Pta.Arenas'], 10, 'macetero de alta gama', TipoProductos.Macetero, 0, 500,'MA5'),
      new Producto(  6, 'macetero celeste', ['http://lugar.com/imagen_m2.png'], 0, 2500, ['Arica a Pta.Arenas'],  10, 'macetero interior', TipoProductos.Macetero,  0, 250, 'MA6'),
      new Producto(  7, 'macetero rosa', ['http://lugar.com/imagen_m1.png'], 0, 1500, ['Arica a Pta.Arenas'], 10, 'macetero de alta gama',TipoProductos.Macetero, 0, 320, 'MA7'),
      new Producto(  8, 'macetero plomo', ['http://lugar.com/imagen_m2.png'], 0, 2500, ['Arica a Pta.Arenas'], 10,'macetero interior', TipoProductos.Macetero, 0, 0,'MA8' ),

      new Producto(  9,'fetilizante prueba 1', ['http://lugar.com/imagen_f1.png'], 0, 2500, ['Arica a Pta.Arenas'], 10,'no tiene', TipoProductos.Fertilizantes, 0, 500, 'FE1' ),
      new Producto( 10,'fetilizante prueba 2', ['http://lugar.com/imagen_f2.png'], 0,1500, ['Arica a Pta.Arenas'], 10, 'tampoco tiene', TipoProductos.Fertilizantes, 0, 500,'FE2'),

      new Producto( 11,  'control plaga prueba 1', ['http://lugar.com/imagen_cp1.png'],  0, 2500,  ['Arica a Pta.Arenas'],  10, 'no tiene',  TipoProductos.ControlPlagas, 0, 2500, 'CP1' ),

      new Producto( 12,'Cactus Opuntia',['https://acdn.mitiendanube.com/stores/001/202/679/products/opuntia-microdasys-amarilla11-f96f80e136ac2b347816196560098082-1024-1024.webp'], 10, 8360, ['Arica a Pta.Arenas'], 10,'Es un cactus firme y decorativo.',TipoProductos.Planta, 4, 150,'PL1' ),
      new Producto( 13,'Lengua de Suegra',['https://lepotit.cl/cdn/shop/products/SansevieriaMAutorreganteSblanco_860x.jpg?v=1633118960', ],  12,  12900, ['Arica a Pta.Arenas'], 55,'Es una planta de interior popular.',  TipoProductos.Planta,  1, 100, 'PL2' ),
      new Producto( 14, 'Lirio de Agua', ['https://acdn.mitiendanube.com/stores/001/202/679/products/231-ad700e1f90d14e71ed16246336798562-1024-1024.webp', ],   20, 8360, ['Arica a Pta.Arenas'], 12,'Es una planta acuática decorativa.', TipoProductos.Planta, 4, 120, 'PL3'  ),
      new Producto( 15, 'Monstera deliciosa',['https://www.kenaz.cl/cdn/shop/products/monstera-946603.jpg?v=1718161088&width=600', ], 17, 7456,['Arica a Pta.Arenas'],10,'Es una planta tropical ideal para interiores.', TipoProductos.Planta,3,130,'PL4' ),
      new Producto( 16, 'Helecho', ['https://cdnx.jumpseller.com/mentaconcept/image/41835179/resize/480/480?1699388964',],18, 9000, ['Arica a Pta.Arenas'], 32,'Es una planta común en ambientes húmedos.',TipoProductos.Planta, 2, 180,'PL5' ),
      new Producto( 17,'Ficus lyrata', ['https://viverolosaromos.com/wp-content/uploads/2023/11/EXALTATA-HELECHO-510x510.webp', ], 22,5779, ['Arica a Pta.Arenas'], 20,'Es una planta popular de gran tamaño.',TipoProductos.Planta, 5, 300,'PL6' ),
      new Producto( 18, 'Filodendro Longipetiolatum', [ 'https://www.kenaz.cl/cdn/shop/products/peperomia-cucharita-561186.jpg?v=1701109062&width=600', ], 30, 5320,['Arica a Pta.Arenas'], 100,'Es una planta tropical común.', TipoProductos.Planta,1,90,'PL7' ),
      new Producto( 19, 'Peperomia obtusifolia',  [ 'https://d17jkdlzll9byv.cloudfront.net/wp-content/uploads/2023/06/ficus-lyrata-0002-900x900.jpg',  ], 25, 9425, ['Arica a Pta.Arenas'], 34,'Es una planta compacta y popular en interiores.', TipoProductos.Planta, 2, 120,'PL8' ),
      new Producto( 20, 'Pilea peperomioides', ['https://www.aprilplants.com/cdn/shop/products/Eucalipto_silver_dollar_copa_22o_cocoblanca_planta-de-exterior-aromatica_1024x.jpg?v=1679046875', ], 40, 7530, ['Arica a Pta.Arenas'],  25, 'Es una planta compacta y decorativa.',TipoProductos.Planta, 1,100,'PL9' ),
      new Producto( 21,'Dollar variegado', ['https://d17jkdlzll9byv.cloudfront.net/wp-content/uploads/2024/02/philodendron-longifolio-00001.jpg', ], 30, 6900,['Arica a Pta.Arenas'], 50,'Es una planta tropical de hojas variegadas.', TipoProductos.Planta, 4, 200, 'PL10' ),
      new Producto( 22,'Oulluy', ['https://m.media-amazon.com/images/I/51rjakslj5L._AC_SX569_.jpg'],50,9120,['Arica a Pta.Arenas'],60, 'Es una planta suculenta decorativa.',TipoProductos.Planta, 5, 300,'PL11' ),
      new Producto( 23,'Begonia',['https://vitaflor.cl/wp-content/uploads/2022/12/aloe-striata-1536x1152.jpg.webp',], 30, 1110, ['Arica a Pta.Arenas'], 100,'Es una planta ornamental común.',TipoProductos.Planta, 1, 100,'PL12' ),
      new Producto( 24,'Alocasia',['https://imgix.be.green/63860658cd20e331480209.jpg?w=1200&h=1200&auto=compress',],15,5150,['Arica a Pta.Arenas'],45,'Es una planta de interior elegante y tropical.',TipoProductos.Planta,1, 90,'PL13' ),
      new Producto( 25, 'Syngonium', [ 'https://www.cactussuculovers.cl/wp-content/uploads/2020/08/086b3977-dab8-4a35-bbcd-0b93596504ce-copia.jpg',],18, 6150, ['Arica a Pta.Arenas'], 34,'Es una planta decorativa de hojas en forma de flecha.', TipoProductos.Planta, 2, 80,'PL14' ),
      new Producto( 26,'Pachira Aquatica',['https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRD4KlhDv3R0dc7SRP8XjrDIRjumKFmpv1J6pA2tW_XQ6JgsXUl',],22,7530,['Arica a Pta.Arenas'],50,'Es una planta de interior con tronco decorativo.',TipoProductos.Planta,3,120,'PL15' ),
      new Producto( 27, 'Begonia Rex', ['https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRD4KlhDv3R0dc7SRP8XjrDIRjumKFmpv1J6pA2tW_XQ6JgsXUl',],10, 6100,['Arica a Pta.Arenas'], 60,'Es una begonia decorativa con hojas de colores vivos.',TipoProductos.Planta, 2, 110,'PL16'),
      
      new Producto( 28,  'control plaga prueba2', ['http://lugar.com/imagen_cp2.png'], 0, 1500,  ['Arica a Pta.Arenas'],  10, 'tampoco tiene', TipoProductos.ControlPlagas, 0, 2510, 'CP2' ),
      
      new Producto( 29, 'Mezcla para plantas de interior con perlita', ['http://lugar.com/imagen_s1.png'], 0, 25000, ['Arica a Pta.Arenas'],  1500, 'Ideal para plantas de interior que necesitan drenaje',  TipoProductos.Sustratos, 0,  481,  'SU1' ),
      new Producto( 30,'Sustrato con turba y perlita', ['http://lugar.com/imagen_s2.png'], 0, 25000, ['Arica a Pta.Arenas'],  1500, 'Ideal para plantas de interior que necesitan drenaje', TipoProductos.Sustratos, 0, 481, 'SU2' ),
      new Producto( 31, 'Sustrato con turba y perlita', ['http://lugar.com/imagen_s3.png'], 0, 25000, ['Arica a Pta.Arenas'], 1500,'Ideal para plantas de interior que necesitan drenaje', TipoProductos.Sustratos, 0, 481, 'SU2' )
     
    ];
  }

  findAll() {
    return this.productos;
  }
  findbyType(categoria: TipoProductos) {
    if (categoria) {
      const produtos = this.productos.filter(
        (prod) => prod.categoria == categoria,
      );

      if (produtos.length > 0 && categoria == TipoProductos.Macetero) {
        return this.servicioMaceteros.findAll();
      } else if (produtos.length > 0 && categoria == TipoProductos.Planta) {
        return this.servicioPLantas.findAll();
      } else if (
        produtos.length > 0 &&
        categoria == TipoProductos.Fertilizantes
      ) {
        return this.servicioFertilizantes.findAll();
      } else if (
        produtos.length > 0 &&
        categoria == TipoProductos.ControlPlagas
      ) {
        return this.servicioControlPlagas.findAll();
      } else if (produtos.length > 0 && categoria == TipoProductos.Sustratos) {
        return this.servicioSustratos.findAll();
      }
    }
    return null;
  }
  obtCantidadProductos() {
    const cantidadProductos = this.productos.length;
    return cantidadProductos;
  }
  createMacetero(createMaceteroDto: CreateMaceteroDto) {
    const idProducto: number = this.obtCantidadProductos() + 1;
    const codigoProducto = this.servicioMaceteros.createCodigoMacetero();
    const productoMacetero: Producto = new Producto(
      idProducto,
      createMaceteroDto.nombreProducto,
      createMaceteroDto.imagenProducto,
      createMaceteroDto.descuento,
      createMaceteroDto.precioNormal,
      createMaceteroDto.coberturaDeDespacho,
      createMaceteroDto.stock,
      createMaceteroDto.descripcionProducto,
      TipoProductos.Macetero,
      0,
      0,
      codigoProducto,
    );

    this.productos.push(productoMacetero);
    const maceteroCreado = this.servicioMaceteros.create(
      createMaceteroDto,
      idProducto,
      codigoProducto,
    );
    return maceteroCreado;
  }

  createPlanta(createPlantaDto: CreatePlantaDto) {
    const idProducto: number = this.obtCantidadProductos() + 1;
    const codigoProducto = this.servicioPLantas.createCodigoPlanta();
    const productoPlanta: Producto = new Producto(
      idProducto,
      createPlantaDto.nombreProducto,
      createPlantaDto.imagenProducto,
      createPlantaDto.descuento,
      createPlantaDto.precioNormal,
      createPlantaDto.coberturaDeDespacho,
      createPlantaDto.stock,
      createPlantaDto.descripcionProducto,
      TipoProductos.Planta,
      0,
      0,
      codigoProducto,
    );

    this.productos.push(productoPlanta);
    const plantaCreada = this.servicioPLantas.create(
      createPlantaDto,
      idProducto,
      codigoProducto,
    );
    return plantaCreada;
  }

  createControlPlagas(createControlPlagasDto: CreateControlPlagasDto) {
    const idProducto: number = this.obtCantidadProductos() + 1;
    const codigoProducto =
      this.servicioControlPlagas.createCodigoControlPlagas();
    const productoControlPlagas: Producto = new Producto(
      idProducto,
      createControlPlagasDto.nombreProducto,
      createControlPlagasDto.imagenProducto,
      createControlPlagasDto.descuento,
      createControlPlagasDto.precioNormal,
      createControlPlagasDto.coberturaDeDespacho,
      createControlPlagasDto.stock,
      createControlPlagasDto.descripcionProducto,
      TipoProductos.ControlPlagas,
      0,
      0,
      codigoProducto,
    );

    this.productos.push(productoControlPlagas);
    const controlPlagasCreado = this.servicioControlPlagas.create(
      createControlPlagasDto,
      idProducto,
      codigoProducto,
    );
    return controlPlagasCreado;
  }

  createFertilizante(createFertilizanteDto: CreateFertilizanteDto) {
    const idProducto: number = this.obtCantidadProductos() + 1;
    const codigoProducto =
      this.servicioFertilizantes.createCodigoFertilizantes();
    const productoFertilizante: Producto = new Producto(
      idProducto,
      createFertilizanteDto.nombreProducto,
      createFertilizanteDto.imagenProducto,
      createFertilizanteDto.descuento,
      createFertilizanteDto.precioNormal,
      createFertilizanteDto.coberturaDeDespacho,
      createFertilizanteDto.stock,
      createFertilizanteDto.descripcionProducto,
      TipoProductos.Fertilizantes,
      0,
      0,
      codigoProducto,
    );

    this.productos.push(productoFertilizante);
    const FertilizanteCreado = this.servicioFertilizantes.create(
      createFertilizanteDto,
      idProducto,
      codigoProducto,
    );
    return FertilizanteCreado;
  }

  createSustrato(createSustrato: CreateSustratoDto) {
    const idProducto: number = this.obtCantidadProductos() + 1;
    const codigoProducto = this.servicioSustratos.createCodigo();
    const productoSustrato: Producto = new Producto(
      idProducto,
      createSustrato.nombreProducto,
      createSustrato.imagenProducto,
      createSustrato.descuento,
      createSustrato.precioNormal,
      createSustrato.coberturaDeDespacho,
      createSustrato.stock,
      createSustrato.descripcionProducto,
      TipoProductos.Sustratos,
      0,
      0,
      codigoProducto,
    );

    this.productos.push(productoSustrato);
    const sustratoCreado = this.servicioSustratos.create(
      createSustrato,
      idProducto,
      codigoProducto,
    );
    return sustratoCreado;
  }

  findOne(codigoProducto: string) {
    const tipoProducto = this.productos.find(
      (prod) => prod.codigoProducto == codigoProducto.toUpperCase().trim(),
    );
    if (!tipoProducto) {
      throw new ErrorPlantopia('No encontrado', 404);
    }
    const categoria = tipoProducto.categoria;
    const idProducto = tipoProducto.idProducto;
    if (categoria == TipoProductos.Macetero) {
      return this.servicioMaceteros.findOne(idProducto);
    } else if (categoria == TipoProductos.Planta) {
      return this.servicioPLantas.findOne(idProducto);
    } else if (categoria == TipoProductos.Fertilizantes) {
      return this.servicioFertilizantes.findOne(idProducto);
    } else if (categoria == TipoProductos.ControlPlagas) {
      return this.servicioControlPlagas.findOne(idProducto);
    } else if (categoria == TipoProductos.Sustratos) {
      return this.servicioSustratos.findOne(idProducto);
    }
  }

  bestSellers() {
    if (this.productos.length == 0) {
      throw new ErrorPlantopia('No encontrado', 404);
    }
    const total_productos = this.productos.length - 1;
    const total_ventas = this.productos
      .filter((a) => a.cantidadVentas > 0)
      .reduce((sum, a) => sum + a.cantidadVentas, 0);
    if (total_ventas == 0) {
      throw new ErrorPlantopia('No encontrado', 404);
    }
    const promedio = total_ventas / total_productos;
    const productosMasVentas = this.productos
      .filter((a) => a.cantidadVentas > promedio)
      .sort((a, b) => b.cantidadVentas - a.cantidadVentas);
    //  .slice(0, 3); /*solo devuelve  3*/
    return productosMasVentas;
  }
  findOneID(id: number) {
    const productoBuscado = this.productos.filter(
      (prod) => prod.idProducto == id,
    );
    if (!productoBuscado) {
      throw new ErrorPlantopia('Producto No encontrado', 404);
    }

    return productoBuscado;
  }
}
