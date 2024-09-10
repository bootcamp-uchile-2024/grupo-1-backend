import { Injectable } from '@nestjs/common';
import { CreateFertilizanteDto } from './dto/create-fertilizante.dto';
import { UpdateFertilizanteDto } from './dto/update-fertilizante.dto';
import { VerFertilizantes } from './dto/ver-fertilizantes-dto';
import { Fertilizante } from './entities/fertilizante.entity';
import { TipoProductos } from 'src/productos/entities/enum-productos';

@Injectable()
export class FertilizantesService {
  masVendidos: VerFertilizantes[] =[];
  catalogo: VerFertilizantes[] =[];
  constructor()
  {
   /* let ventasFertilizantes: VerFertilizantes = new VerFertilizantes();
    ventasFertilizantes.id=2 ;
    ventasFertilizantes.nombreProducto= 'Fertilizante equilibrado 20-20-20';
    ventasFertilizantes.stock= 1200;
    ventasFertilizantes.precio= 2500;
    ventasFertilizantes.imagen= 'https://example.com/fertilizante_2.jpg';
    ventasFertilizantes.valoracion= 5.5;
    ventasFertilizantes.cantidadVentas= 120; 
   ventasFertilizantes.marca ='Mas-Vida';

    this.masVendidos.push(ventasFertilizantes);
    this.catalogo.push(ventasFertilizantes);
    let ventasFertilizantes2: VerFertilizantes = new VerFertilizantes();
    ventasFertilizantes2.id=7 ;
    ventasFertilizantes2.nombreProducto= 'Fertilizante líquido para follaje';
    ventasFertilizantes2.stock= 245;
    ventasFertilizantes2.precio= 3500;
    ventasFertilizantes2.imagen= 'https://example.com/fertilizante_7.jpg';
    ventasFertilizantes2.valoracion= 6.0;
    ventasFertilizantes2.cantidadVentas= 1; 
    ventasFertilizantes.marca ='Mas-Flora';
    this.masVendidos.push(ventasFertilizantes2);
    this.catalogo.push(ventasFertilizantes2);
    let catalogo3: VerFertilizantes = new VerFertilizantes();
    catalogo3.id=8 ;
    catalogo3.nombreProducto= 'Fertilizante balanceado 10-10-10';
    catalogo3.stock= 150;
    catalogo3.precio= 4000;
    catalogo3.imagen= 'https://example.com/fertilizante_9.jpg';
    catalogo3.valoracion= 7.0;
    catalogo3.cantidadVentas= 250; 
    catalogo3.marca ='Mas-Flora';
    
    this.catalogo.push(catalogo3);*/
  }

  fertilizantes:Fertilizante[]=[]




  obtCantidadFertilizantes() {
    const cantidadFertilizantes= this.fertilizantes.length;
    return  cantidadFertilizantes;
  }
  createCodigoFertilizantes(){
    const numeroCodigo =  this.obtCantidadFertilizantes() + 1;
    const codigoFertilizante = 'FER' + numeroCodigo;
    return codigoFertilizante
  }


   create(createFertilizanteDto: CreateFertilizanteDto, idProducto: number, codigoProducto:string) {
    const creFertilizante: Fertilizante = new  Fertilizante(  idProducto,createFertilizanteDto.nombreProducto,
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
                                                  createFertilizanteDto.composición, 
                                                  createFertilizanteDto.tipo, 
                                                  createFertilizanteDto.frecuenciaAplicacion, 
                                                  createFertilizanteDto.presentacion, 
                                                  createFertilizanteDto.observaciones, 
                                                  createFertilizanteDto.tiposPlantasRecomendadas 
                                                );

    this.fertilizantes.push(creFertilizante);
    return creFertilizante;
  }


  listaMasVendidas() {
    return this.masVendidos;
  }

  findAll() {
    return this.catalogo;
  }

  findOne(id: number) {
    return `This action returns a #${id} fertilizante`;
  }

  update(id: number, updateFertilizanteDto: UpdateFertilizanteDto) {
    return `This action updates a #${id} fertilizante`;
  }

  remove(id: number) {
    return `This action removes a #${id} fertilizante`;
  }
}
