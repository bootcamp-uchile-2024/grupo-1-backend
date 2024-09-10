import { Injectable } from '@nestjs/common';
import { CreateControlPlagasDto } from './dto/create-control-plagas.dto';
import { UpdateControlPlagasDto } from './dto/update-control-plagas.dto';
import { VerControlPlagas } from './dto/ver-control-plagas-dto';
import { ControlPlagas } from './entities/control-plagas.entity';
import { TipoProductos } from 'src/productos/entities/enum-productos';

@Injectable()
export class ControlPlagasService {
  constructor() {
    /*let ventasSustratos: VerControlPlagas = new VerControlPlagas();
    ventasSustratos.id=4 ;
    ventasSustratos.nombreProducto= 'Aceite de neem';
    ventasSustratos.stock= 150;
    ventasSustratos.precio= 8750;
    ventasSustratos.imagen= 'https://example.com/controlplaga_4.jpg';
    ventasSustratos.valoracion= 8.0;
    ventasSustratos.cantidadVentas= 180;
     this.masVendidos.push(ventasSustratos);
    this.catalogo.push(ventasSustratos);
    let ventasSustratos2: VerControlPlagas = new VerControlPlagas();
    ventasSustratos2.id=12;
    ventasSustratos2.nombreProducto= 'Jabón potásico';
    ventasSustratos2.stock= 100;
    ventasSustratos2.precio= 10000;
    ventasSustratos2.imagen= 'https://example.com/controlplaga_12.jpg';
    ventasSustratos2.valoracion= 7.0;
    ventasSustratos2.cantidadVentas= 251;

    this.masVendidos.push(ventasSustratos2);
    this.catalogo.push(ventasSustratos2);
    let catalogo3: VerControlPlagas = new VerControlPlagas();
  catalogo3.id=13 ;
    catalogo3.nombreProducto= 'Insecticida a base de piretrina';
    catalogo3.stock= 200;
    catalogo3.precio= 15500;
    catalogo3.imagen= 'https://example.com/controlplaga_13.jpg';
    catalogo3.valoracion= 7.0;
    catalogo3.cantidadVentas= 2;
    this.catalogo.push(catalogo3);*/
  }

  masVendidos: VerControlPlagas[] = [];
  catalogo: VerControlPlagas[] = [];
  controlPlagas: ControlPlagas[] = [];

  create(
    createControlPlagasDto: CreateControlPlagasDto,
    idProducto: number,
    codigoProducto: string,
  ) {
    const creControlPLagas: ControlPlagas = new ControlPlagas(
      idProducto,
      createControlPlagasDto.nombreProducto,
      createControlPlagasDto.imagenProducto,
      createControlPlagasDto.descuento,
      createControlPlagasDto.precioNormal,
      createControlPlagasDto.coberturaDeDespacho,
      createControlPlagasDto.stock,
      createControlPlagasDto.descripcionProducto,
      TipoProductos['Control Plagas'],
      0,
      0,
      codigoProducto,
      createControlPlagasDto.TipoPlagaControlada,
      createControlPlagasDto.composicion,
      createControlPlagasDto.metodoAplicacion,
      createControlPlagasDto.frecuenciaAplicacion,
      createControlPlagasDto.precauciones,
      createControlPlagasDto.eficacia,
      createControlPlagasDto.Toxicidad,
    );

    this.controlPlagas.push(creControlPLagas);
    return creControlPLagas;
  }

  obtCantidadControlPlagas() {
    const cantidadControlPLagas = this.controlPlagas.length;
    return cantidadControlPLagas;
  }
  createCodigoControlPlagas() {
    const numeroCodigo = this.obtCantidadControlPlagas() + 1;
    const codigoControlPlagas = 'CTRPLA' + numeroCodigo;
    return codigoControlPlagas;
  }

  listaMasVendidas() {
    return this.masVendidos;
  }

  findAll() {
    return this.catalogo;
  }

  findOne(id: number) {
    return `This action returns a #${id} controlPlagas`;
  }

  update(id: number, updateControlPlagasDto: UpdateControlPlagasDto) {
    return `This action updates a #${id} controlPlagas`;
  }

  remove(id: number) {
    return `This action removes a #${id} controlPlagas`;
  }
}
