import { Injectable } from '@nestjs/common';
import { CreateSustratoDto } from './dto/create-sustrato.dto';
import { UpdateSustratoDto } from './dto/update-sustrato.dto';
import { VerSustratos } from './dto/ver-sustratos-dto';
import { Sustrato } from './entities/sustrato.entity';

@Injectable()
export class SustratosService {
  masVendidos: VerSustratos[] = [];
  catalogo: VerSustratos[] = [];
  addSustratos: Sustrato[] = [];

  constructor() {
    /* let ventasSustratos: VerSustratos = new VerSustratos();
    ventasSustratos.id=3 ;
    ventasSustratos.nombreProducto= 'Mezcla para plantas de interior con perlita';
    ventasSustratos.stock= 80;
    ventasSustratos.precio= 1500;
    ventasSustratos.imagen= 'https://example.com/sustrato_3.jpg';
    ventasSustratos.valoracion= 4.5;
    ventasSustratos.cantidadVentas= 140;
     this.masVendidos.push(ventasSustratos);
    this.catalogo.push(ventasSustratos);
    let ventasSustratos2: VerSustratos = new VerSustratos();
    ventasSustratos2.id=10;
    ventasSustratos2.nombreProducto= 'Sustrato con turba y perlita';
    ventasSustratos2.stock= 180;
    ventasSustratos2.precio= 1600;
    ventasSustratos2.imagen= 'https://example.com/sustrato_10.jpg';
    ventasSustratos2.valoracion= 6.0;
    ventasSustratos2.cantidadVentas= 161;

    this.masVendidos.push(ventasSustratos2);
    this.catalogo.push(ventasSustratos2);
    let catalogo3: VerSustratos = new VerSustratos();
    catalogo3.id=11 ;
    catalogo3.nombreProducto= 'Sustrato universal con buen drenaje';
    catalogo3.stock= 170;
    catalogo3.precio= 210;
    catalogo3.imagen= 'https://example.com/sustrato_11.jpg';
    catalogo3.valoracion= 7.0;
    catalogo3.cantidadVentas= 10;
    this.catalogo.push(catalogo3);*/
  }
  create(createSustratoDto: CreateSustratoDto) {
    return 'This action adds a new sustrato';
  }

  listaMasVendidas() {
    return this.masVendidos;
  }

  findAll() {
    return this.catalogo;
  }
  findOne(id: number, ParseIntPipe: Number) {
    return `This action returns a #${id} sustrato`;
  }

  update(id: number, updateSustratoDto: UpdateSustratoDto) {
    return `This action updates a #${id} sustrato`;
  }

  remove(id: number) {
    return `This action removes a #${id} sustrato`;
  }
}
