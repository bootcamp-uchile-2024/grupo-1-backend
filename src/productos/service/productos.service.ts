import { Injectable } from '@nestjs/common';
import { CreateMaceteroDto } from '../dto/create-macetero.dto';
import { CreatePlantaDto } from '../dto/create-planta.dto';
import { CreateControlPlagasDto } from '../dto/create-control-plagas.dto';
import { ErrorPlantopia } from 'src/comunes/error-plantopia/error-plantopia';
import { Producto } from 'entitipt/producto.entity';
import { CreateFertilizanteDto } from '../dto/create-fertilizante.dto';
import { CreateSustratoDto } from '../dto/create-sustrato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ProductosService {
  productos: Producto[] = [];
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    //    private readonly servicioMaceteros: MaceterosService,
    //    private readonly servicioPLantas: PlantasService,
    //    private readonly servicioControlPlagas: ControlPlagasService,
    //    private readonly servicioFertilizantes: FertilizantesService,
    //    private readonly servicioSustratos: SustratosService,
  ) {}
  // findAll() {
  //   return this.productos;
  // }
  // findbyType(categoria: TipoProductos) {
  //   if (categoria) {
  //     const produtos = this.productos.filter(
  //       (prod) => prod.categoria == categoria,
  //     );
  //
  //     if (produtos.length > 0 && categoria == TipoProductos.Macetero) {
  //       return this.servicioMaceteros.findAll();
  //     } else if (produtos.length > 0 && categoria == TipoProductos.Planta) {
  //       return this.servicioPLantas.findAll();
  //     } else if (
  //       produtos.length > 0 &&
  //       categoria == TipoProductos.Fertilizantes
  //     ) {
  //       return this.servicioFertilizantes.findAll();
  //     } else if (
  //       produtos.length > 0 &&
  //       categoria == TipoProductos.ControlPlagas
  //     ) {
  //       return this.servicioControlPlagas.findAll();
  //     } else if (produtos.length > 0 && categoria == TipoProductos.Sustratos) {
  //       return this.servicioSustratos.findAll();
  //     }
  //   }
  //   return null;
  // }
  // obtCantidadProductos() {
  //   const cantidadProductos = this.productos.length;
  //   return cantidadProductos;
  // }
  // createMacetero(createMaceteroDto: CreateMaceteroDto) {
  //   const idProducto: number = this.obtCantidadProductos() + 1;
  //   const codigoProducto = this.servicioMaceteros.createCodigoMacetero();
  //   const productoMacetero: Producto = new Producto(
  //     idProducto,
  //     createMaceteroDto.nombreProducto,
  //     createMaceteroDto.imagenProducto,
  //     createMaceteroDto.descuento,
  //     createMaceteroDto.precioNormal,
  //     createMaceteroDto.coberturaDeDespacho,
  //     createMaceteroDto.stock,
  //     createMaceteroDto.descripcionProducto,
  //     TipoProductos.Macetero,
  //     0,
  //     0,
  //     codigoProducto,
  //   );
  //
  //   this.productos.push(productoMacetero);
  //   const maceteroCreado = this.servicioMaceteros.create(
  //     createMaceteroDto,
  //     idProducto,
  //     codigoProducto,
  //   );
  //   return maceteroCreado;
  // }
  // createPlanta(createPlantaDto: CreatePlantaDto) {
  //   const idProducto: number = this.obtCantidadProductos() + 1;
  //   const codigoProducto = this.servicioPLantas.createCodigoPlanta();
  //   const productoPlanta: Producto = new Producto(
  //     idProducto,
  //     createPlantaDto.nombreProducto,
  //     createPlantaDto.imagenProducto,
  //     createPlantaDto.descuento,
  //     createPlantaDto.precioNormal,
  //     createPlantaDto.coberturaDeDespacho,
  //     createPlantaDto.stock,
  //     createPlantaDto.descripcionProducto,
  //     TipoProductos.Planta,
  //     0,
  //     0,
  //     codigoProducto,
  //   );
  //   this.productos.push(productoPlanta);
  //   const plantaCreada = this.servicioPLantas.create(
  //     createPlantaDto,
  //     idProducto,
  //     codigoProducto,
  //   );
  //   return plantaCreada;
  // }
  // createControlPlagas(createControlPlagasDto: CreateControlPlagasDto) {
  //   const idProducto: number = this.obtCantidadProductos() + 1;
  //   const codigoProducto =
  //     this.servicioControlPlagas.createCodigoControlPlagas();
  //   const productoControlPlagas: Producto = new Producto(
  //     idProducto,
  //     createControlPlagasDto.nombreProducto,
  //     createControlPlagasDto.imagenProducto,
  //     createControlPlagasDto.descuento,
  //     createControlPlagasDto.precioNormal,
  //     createControlPlagasDto.coberturaDeDespacho,
  //     createControlPlagasDto.stock,
  //     createControlPlagasDto.descripcionProducto,
  //     TipoProductos.ControlPlagas,
  //     0,
  //     0,
  //     codigoProducto,
  //   );
  //   this.productos.push(productoControlPlagas);
  //   const controlPlagasCreado = this.servicioControlPlagas.create(
  //     createControlPlagasDto,
  //     idProducto,
  //     codigoProducto,
  //   );
  //   return controlPlagasCreado;
  // }
  // createFertilizante(createFertilizanteDto: CreateFertilizanteDto) {
  //   const idProducto: number = this.obtCantidadProductos() + 1;
  //   const codigoProducto =
  //     this.servicioFertilizantes.createCodigoFertilizantes();
  //   const productoFertilizante: Producto = new Producto(
  //     idProducto,
  //     createFertilizanteDto.nombreProducto,
  //     createFertilizanteDto.imagenProducto,
  //     createFertilizanteDto.descuento,
  //     createFertilizanteDto.precioNormal,
  //     createFertilizanteDto.coberturaDeDespacho,
  //     createFertilizanteDto.stock,
  //     createFertilizanteDto.descripcionProducto,
  //     TipoProductos.Fertilizantes,
  //     0,
  //     0,
  //     codigoProducto,
  //   );
  //   this.productos.push(productoFertilizante);
  //   const FertilizanteCreado = this.servicioFertilizantes.create(
  //     createFertilizanteDto,
  //     idProducto,
  //     codigoProducto,
  //   );
  //   return FertilizanteCreado;
  // }
  // createSustrato(createSustrato: CreateSustratoDto) {
  //   const idProducto: number = this.obtCantidadProductos() + 1;
  //   const codigoProducto = this.servicioSustratos.createCodigo();
  //   const productoSustrato: Producto = new Producto(
  //     idProducto,
  //     createSustrato.nombreProducto,
  //     createSustrato.imagenProducto,
  //     createSustrato.descuento,
  //     createSustrato.precioNormal,
  //     createSustrato.coberturaDeDespacho,
  //     createSustrato.stock,
  //     createSustrato.descripcionProducto,
  //     TipoProductos.Sustratos,
  //     0,
  //     0,
  //     codigoProducto,
  //   );
  //   this.productos.push(productoSustrato);
  //   const sustratoCreado = this.servicioSustratos.create(
  //     createSustrato,
  //     idProducto,
  //     codigoProducto,
  //   );
  //   return sustratoCreado;
  // }
  // findOne(codigoProducto: string) {
  //   const tipoProducto = this.productos.find(
  //     (prod) => prod.codigoProducto == codigoProducto.toUpperCase().trim(),
  //   );
  //   if (!tipoProducto) {
  //     throw new ErrorPlantopia('No encontrado', 404);
  //   }
  //   const categoria = tipoProducto.categoria;
  //   const idProducto = tipoProducto.idProducto;
  //   if (categoria == TipoProductos.Macetero) {
  //     return this.servicioMaceteros.findOne(idProducto);
  //   } else if (categoria == TipoProductos.Planta) {
  //     return this.servicioPLantas.findOne(idProducto);
  //   } else if (categoria == TipoProductos.Fertilizantes) {
  //     return this.servicioFertilizantes.findOne(idProducto);
  //   } else if (categoria == TipoProductos.ControlPlagas) {
  //     return this.servicioControlPlagas.findOne(idProducto);
  //   } else if (categoria == TipoProductos.Sustratos) {
  //     return this.servicioSustratos.findOne(idProducto);
  //   }
  // }
  // bestSellers() {
  //   if (this.productos.length == 0) {
  //     throw new ErrorPlantopia('No encontrado', 404);
  //   }
  //   const total_productos = this.productos.length - 1;
  //   const total_ventas = this.productos
  //     .filter((a) => a.cantidadVentas > 0)
  //     .reduce((sum, a) => sum + a.cantidadVentas, 0);
  //   if (total_ventas == 0) {
  //     throw new ErrorPlantopia('No encontrado', 404);
  //   }
  //   const promedio = total_ventas / total_productos;
  //   const productosMasVentas = this.productos
  //     .filter((a) => a.cantidadVentas > promedio)
  //     .sort((a, b) => b.cantidadVentas - a.cantidadVentas); //  .slice(0, 3); /*solo devuelve  3*/
  //   return productosMasVentas;
  // }
  // findOneID(id: number) {
  //   const productoBuscado = this.productos.filter(
  //     (prod) => prod.idProducto == id,
  //   );
  //   if (!productoBuscado) {
  //     throw new ErrorPlantopia('Producto No encontrado', 404);
  //   }
  //   return productoBuscado;
  // }
  // CATALOGO de productos
  // busca todos los productos
  async findallcatalogo(): Promise<Producto[]> {
    console.log('entro al servicio catalogo de producto ');
    const productos = await this.productoRepository.find({
      relations: ['categoria'],
    });
    return productos;
  }
  // busca un producto por id
  //  async porProducto(): Promise<Producto[]> {
  async porProducto(id: number): Promise<Producto> {
    const productos = await this.productoRepository.find({
      relations: ['categoria'],
    });
    return productos.find((producto) => producto.id === id);
  }
}