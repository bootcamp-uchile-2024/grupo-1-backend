import { Injectable } from '@nestjs/common';


import { Macetero } from 'src/maceteros/entities/macetero.entity';
import { FormaMacetero } from 'src/maceteros/entities/enum-macetero';

import { CreateMaceteroDto } from 'src/maceteros/dto/create-macetero.dto';
import { CreatePlantaDto } from 'src/plantas/dto/create-planta.dto';
import { CreateControlPlagasDto } from 'src/control-plagas/dto/create-control-plagas.dto';

import { ErrorPlantopia } from 'src/error-plantopia/error-plantopia';
import { Producto } from '../entities/producto.entity';
import { TipoProductos } from '../entities/enum-productos';
import { MaceterosService } from 'src/maceteros/service/maceteros.service';
import { PlantasService } from 'src/plantas/plantas.service';

import { ControlPlagasService } from 'src/control-plagas/control-plagas.service';
import { CreateFertilizanteDto } from 'src/fertilizantes/dto/create-fertilizante.dto';
import { FertilizantesService } from 'src/fertilizantes/fertilizantes.service';

@Injectable()
export class ProductosService {
  productos: Producto[] = [];
  constructor(private readonly servicioMaceteros: MaceterosService,private readonly servicioPLantas: PlantasService,private readonly servicioControlPlagas:ControlPlagasService, private readonly servicioFertilizantes:FertilizantesService) {
    this.productos = [new Producto(1, 'macetero rojo', ['http://lugar.com/imagen_m1.png'], 0, 1500, ['Arica a Pta.Arenas'], 10, 'macetero de alta gama', TipoProductos.Macetero, 0, 0, 'MA1'),
    new Producto(2, 'macetero blanco', ['http://lugar.com/imagen_m2.png'], 0, 2500, ['Arica a Pta.Arenas'], 10, 'macetero interior', TipoProductos.Macetero, 0, 500, 'MA2'),
    new Producto(3, 'macetero verde', ['http://lugar.com/imagen_m1.png'], 0, 1500, ['Arica a Pta.Arenas'], 10, 'macetero de alta gama', TipoProductos.Macetero, 0, 500, 'MA3'),
    new Producto(4, 'macetero azul', ['http://lugar.com/imagen_m2.png'], 0, 2500, ['Arica a Pta.Arenas'], 10, 'macetero interior', TipoProductos.Macetero, 0, 0, 'MA4'),
    new Producto(5, 'macetero amarillo', ['http://lugar.com/imagen_m1.png'], 0, 1500, ['Arica a Pta.Arenas'], 10, 'macetero de alta gama', TipoProductos.Macetero, 0, 500, 'MA5'),
    new Producto(6, 'macetero celeste', ['http://lugar.com/imagen_m2.png'], 0, 2500, ['Arica a Pta.Arenas'], 10, 'macetero interior', TipoProductos.Macetero, 0, 250, 'MA6'),
    new Producto(7, 'macetero rosa', ['http://lugar.com/imagen_m1.png'], 0, 1500, ['Arica a Pta.Arenas'], 10, 'macetero de alta gama', TipoProductos.Macetero, 0, 320, 'MA7'),
    new Producto(8, 'macetero plomo', ['http://lugar.com/imagen_m2.png'], 0, 2500, ['Arica a Pta.Arenas'], 10, 'macetero interior', TipoProductos.Macetero, 0, 0, 'MA8'),
    new Producto(9, 'Planta de Interior Verde', ['http://lugar.com/imagen_p1.png'], 5, 3000, ['Arica a Pta.Arenas'], 20, 'Planta ideal para interiores con poca luz.', TipoProductos.Planta, 4, 150, 'P9'),
    new Producto(10, 'Sombra de Jardín', ['http://lugar.com/imagen_p2.png'], 10, 1500, ['Arica a Pta.Arenas'], 30, 'Perfecta para dar sombra en jardines grandes.', TipoProductos.Planta, 5, 200, 'P10',),
    new Producto(11, 'Cactus Decorativo', ['http://lugar.com/imagen_p3.png'], 0, 500, ['Arica a Pta.Arenas'], 15, 'Cactus pequeño ideal para decoración de interiores.', TipoProductos.Planta, 3, 100, 'P11')
  ];




  }

  findAll() {
    return this.productos;
  }
  findbyType(categoria: TipoProductos) {
    if (categoria) {
      const produtos = this.productos.filter(prod => prod.categoria == categoria);
      if (produtos.length > 0 && categoria == TipoProductos.Macetero) {
        return this.servicioMaceteros.findAll();
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
    const productoMacetero: Producto = new Producto(idProducto,
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
      codigoProducto);

    this.productos.push(productoMacetero);
    const maceteroCreado = this.servicioMaceteros.create(createMaceteroDto, idProducto, codigoProducto);
    return maceteroCreado;
  }

  createPlanta(createPlantaDto: CreatePlantaDto) {
    const idProducto: number = this.obtCantidadProductos() + 1;
    const codigoProducto = this.servicioPLantas.createCodigoPlanta();
    const productoPlanta: Producto = new Producto(idProducto,
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
      codigoProducto);

    this.productos.push(productoPlanta);
    const plantaCreada = this.servicioPLantas.create(createPlantaDto, idProducto, codigoProducto);
    return plantaCreada;
  }

  createControlPlagas(createControlPlagasDto:CreateControlPlagasDto){
    const idProducto: number = this.obtCantidadProductos() + 1;
    const codigoProducto = this.servicioControlPlagas.createCodigoControlPlagas();
    const productoControlPlagas: Producto = new Producto(idProducto,
      createControlPlagasDto.nombreProducto,
      createControlPlagasDto.imagenProducto,
      createControlPlagasDto.descuento,
      createControlPlagasDto.precioNormal,
      createControlPlagasDto.coberturaDeDespacho,
      createControlPlagasDto.stock,
      createControlPlagasDto.descripcionProducto,
      TipoProductos.Planta,
      0,
      0,
      codigoProducto);

    this.productos.push(productoControlPlagas);
    const controlPlagasCreado = this.servicioControlPlagas.create(createControlPlagasDto, idProducto, codigoProducto);
    return controlPlagasCreado;

  }

  createFertilizante(createFertilizanteDto:CreateFertilizanteDto){
    const idProducto: number = this.obtCantidadProductos() + 1;
    const codigoProducto = this.servicioControlPlagas.createCodigoControlPlagas();
    const productoFertilizante: Producto = new Producto(idProducto,
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
      codigoProducto);

    this.productos.push(productoFertilizante);
    const FertilizanteCreado = this.servicioFertilizantes.create(createFertilizanteDto, idProducto, codigoProducto);
    return FertilizanteCreado;

  }




  findOne(codigoProducto: string) {
    const tipoProducto = this.productos.find(prod => prod.codigoProducto == codigoProducto.toUpperCase().trim());
    if (!tipoProducto) {
      throw new ErrorPlantopia('No encontrado', 404);
    }
    const categoria = tipoProducto.categoria;
    const idProducto = tipoProducto.idProducto;
    if (categoria == TipoProductos.Macetero) {
      return this.servicioMaceteros.findOne(idProducto);
    }
  }

  bestSellers() {
    if (this.productos.length == 0) {
      throw new ErrorPlantopia('No encontrado', 404);
    }
    const total_productos = this.productos.length - 1;
    const total_ventas = this.productos
      .filter(a => a.cantidadVentas > 0)
      .reduce((sum, a) => sum + a.cantidadVentas, 0);
    if (total_ventas == 0) {
      throw new ErrorPlantopia('No encontrado', 404);
    }
    const promedio =  total_ventas/total_productos;
    const productosMasVentas = this.productos
      .filter(a => a.cantidadVentas > promedio)
      .sort((a, b) => b.cantidadVentas - a.cantidadVentas);
    //  .slice(0, 3); /*solo devuelve  3*/
    return productosMasVentas;
  }
}


