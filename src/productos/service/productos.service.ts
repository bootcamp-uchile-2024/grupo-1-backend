import { Injectable } from '@nestjs/common';

import { Macetero } from 'src/maceteros/entities/macetero.entity';
import { FormaMacetero } from 'src/maceteros/entities/enum-macetero';

import { CreateMaceteroDto } from 'src/maceteros/dto/create-macetero.dto';

import { ErrorPlantopia } from 'src/error-plantopia/error-plantopia';
import { Producto } from '../entities/producto.entity';
import { TipoProductos } from '../entities/enum-productos';
import { MaceterosService } from 'src/maceteros/service/maceteros.service';
import { CreateSustratoDto } from 'src/sustratos/dto/create-sustrato.dto';

@Injectable()
export class ProductosService {
  ingresarSustrato(CreateSustratoDto: CreateSustratoDto) {
    const idSustrato: number = this.obtCantidadProductos() + 1;
    const productoSustrato: Producto = new Producto(
      idSustrato,
      CreateSustratoDto.nombreProducto,
      CreateSustratoDto.imagenProducto,
      CreateSustratoDto.descuento,
      CreateSustratoDto.precioNormal,
      CreateSustratoDto.coberturaDeDespacho,
      CreateSustratoDto.stock,
      CreateSustratoDto.descripcionProducto,
      TipoProductos.Sustratos,
      0,
      0,
      CreateSustratoDto.codigoProducto,
    );
    this.productos.push(productoSustrato);
    return ' Esta acción agrega un nuevo sustrato';
  }
  productos: Producto[] = [];
  constructor(private readonly servicioMaceteros: MaceterosService) {
    this.productos = [
      new Producto(
        1,
        'macetero rojo',
        ['http://lugar.com/imagen_m1.png'],
        0,
        1500,
        ['Arica a Pta.Arenas'],
        10,
        'macetero de alta gama',
        TipoProductos.Macetero,
        0,
        0,
        'MA1',
      ),
      new Producto(
        2,
        'macetero blanco',
        ['http://lugar.com/imagen_m2.png'],
        0,
        2500,
        ['Arica a Pta.Arenas'],
        10,
        'macetero interior',
        TipoProductos.Macetero,
        0,
        500,
        'MA2',
      ),
      new Producto(
        3,
        'macetero verde',
        ['http://lugar.com/imagen_m1.png'],
        0,
        1500,
        ['Arica a Pta.Arenas'],
        10,
        'macetero de alta gama',
        TipoProductos.Macetero,
        0,
        500,
        'MA3',
      ),
      new Producto(
        4,
        'macetero azul',
        ['http://lugar.com/imagen_m2.png'],
        0,
        2500,
        ['Arica a Pta.Arenas'],
        10,
        'macetero interior',
        TipoProductos.Macetero,
        0,
        0,
        'MA4',
      ),
      new Producto(
        5,
        'macetero amarillo',
        ['http://lugar.com/imagen_m1.png'],
        0,
        1500,
        ['Arica a Pta.Arenas'],
        10,
        'macetero de alta gama',
        TipoProductos.Macetero,
        0,
        500,
        'MA5',
      ),
      new Producto(
        6,
        'macetero celeste',
        ['http://lugar.com/imagen_m2.png'],
        0,
        2500,
        ['Arica a Pta.Arenas'],
        10,
        'macetero interior',
        TipoProductos.Macetero,
        0,
        250,
        'MA6',
      ),
      new Producto(
        7,
        'macetero rosa',
        ['http://lugar.com/imagen_m1.png'],
        0,
        1500,
        ['Arica a Pta.Arenas'],
        10,
        'macetero de alta gama',
        TipoProductos.Macetero,
        0,
        320,
        'MA7',
      ),
      new Producto(
        8,
        'macetero plomo',
        ['http://lugar.com/imagen_m2.png'],
        0,
        2500,
        ['Arica a Pta.Arenas'],
        10,
        'macetero interior',
        TipoProductos.Macetero,
        0,
        0,
        'MA8',
      ),
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
