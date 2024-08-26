import { Injectable } from '@nestjs/common';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';
import { VerPlantas } from './dto/ver-plantas-dto';
import { Planta } from './entities/planta.entity';
import { DificultadDeCuidado, Estacion, FrecuenciaDeRiego, Habitad, LuzRequerida, NivelDeHumedad, TipoDeSuelo } from './entities/enum-plantas';

@Injectable()
export class PlantasService {
  masVendidos: VerPlantas[] =[];
  catalogo: VerPlantas[] =[];
  constructor()
  {
    let ventasPlantas: VerPlantas = new VerPlantas();
    ventasPlantas.id=1 ;
    ventasPlantas.nombreProducto= 'Rosa';
    ventasPlantas.stock= 100;
    ventasPlantas.precio= 50000;
    ventasPlantas.imagen= 'https://example.com/planta_1.jpg';
    ventasPlantas.valoracion= 4.5;
    ventasPlantas.cantidadVentas= 165; 
    this.masVendidos.push(ventasPlantas);
    this.catalogo.push(ventasPlantas);
    let ventasPlantas2: VerPlantas = new VerPlantas();
    ventasPlantas2.id=5 ;
    ventasPlantas2.nombreProducto= 'Rosa Himalaya';
    ventasPlantas2.stock= 100;
    ventasPlantas2.precio= 70000;
    ventasPlantas2.imagen= 'https://example.com/planta_5.jpg';
    ventasPlantas2.valoracion= 7.0;
    ventasPlantas2.cantidadVentas= 150; 
    this.masVendidos.push(ventasPlantas2);
    this.catalogo.push(ventasPlantas2);
    let catalogo3: VerPlantas = new VerPlantas();
    catalogo3.id=6 ;
    catalogo3.nombreProducto= 'Tulipan Holandes';
    catalogo3.stock= 50;
    catalogo3.precio= 80000;
    catalogo3.imagen= 'https://example.com/planta_6.jpg';
    catalogo3.valoracion= 7.0;
    catalogo3.cantidadVentas= 10; 
    
    this.catalogo.push(catalogo3);
  }
  
  create(createPlantaDto: CreatePlantaDto) {
    return 'This action adds a new planta';
  }
  listaPlantasMasVendidas() {
    return this.masVendidos;
  }

  findAll() {
    return this.catalogo;
  }

  findOne(id: number) {
    return `This action returns a #${id} planta`;
  }

  update(id: number, updatePlantaDto: UpdatePlantaDto) {
    return `This action updates a #${id} planta`;
  }

  remove(id: number) {
    return `This action removes a #${id} planta`;
  }
}
