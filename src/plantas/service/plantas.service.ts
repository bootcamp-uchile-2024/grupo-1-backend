import { Injectable } from '@nestjs/common';
import { TipoProductos } from 'src/productos/entities/enum-productos';
import { DificultadDeCuidado, Estacion, FrecuenciaDeRiego, Habitat, LuzRequerida, NivelDeHumedad, TipoDeSuelo } from '../entities/enum-plantas';
import { Planta } from '../entities/planta.entity';
import { CreatePlantaDto } from '../dto/create-planta.dto';

@Injectable()
export class PlantasService {

  plantas: Planta[] =[];
  constructor(){
   this.plantas = [
    new Planta(  9,  'Planta de Interior Verde',  ['http://lugar.com/imagen_p1.png'],   5,  3000,  ['Arica a Pta.Arenas'],  20, 'Planta ideal para interiores con poca luz.',  TipoProductos.Planta, 4, 150, 'PL1', Habitat.INTERIOR, LuzRequerida.BAJA,  FrecuenciaDeRiego.SEMANAL, NivelDeHumedad.MEDIA,  22,  false,  50,  TipoDeSuelo.ARENOSO,  DificultadDeCuidado.MEDIA,   Estacion.PRIMAVERA,  [12, 13],  [16] ),
    new Planta( 10, 'Sombra de Jardín', ['http://lugar.com/imagen_p2.png'], 10, 1500,['Arica a Pta.Arenas'], 30, 'Perfecta para dar sombra en jardines grandes.', TipoProductos.Planta, 5,  200, 'PL2',  Habitat.EXTERIOR,  LuzRequerida.MEDIA, FrecuenciaDeRiego.DIARIO,  NivelDeHumedad.ALTA, 18, true,80,TipoDeSuelo.TURBA,DificultadDeCuidado.BAJA,Estacion.VERANO, [12], [16,17] ),
    new Planta( 11, 'Cactus Decorativo', ['http://lugar.com/imagen_p3.png'], 0, 500,  ['Arica a Pta.Arenas'], 15, 'Cactus pequeño ideal para decoración de interiores.',TipoProductos.Planta, 3,  1000, 'PL3', Habitat.INTERIOR, LuzRequerida.ALTA, FrecuenciaDeRiego.MENSUAL, NivelDeHumedad.BAJA,  25, false, 20,TipoDeSuelo.ARENOSO,DificultadDeCuidado.ALTA, Estacion.PRIMAVERA, [13], [17,18])
      ];
  }
  obtCantidadPlantas() {
    const cantidadPlantas= this.plantas.length;
    return  cantidadPlantas;
  }
  createCodigoPlanta(){
    const numeroCodigo =  this.obtCantidadPlantas() + 1;
    const codigoPLanta = 'PL' + numeroCodigo;
    return codigoPLanta
  }
  
  create(createPlantaDto: CreatePlantaDto, idProducto: number, codigoProducto: string) {
    const crePlanta: Planta = new Planta(
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
        createPlantaDto.habitat,
        createPlantaDto.luz,
        createPlantaDto.frecuenciaDeRiego,
        createPlantaDto.humedadIdeal,
        createPlantaDto.temperaturaIdeal,
        createPlantaDto.toxicidadMascotas,
        createPlantaDto.tamanoMaximo,
        createPlantaDto.tipoSuelo,
        createPlantaDto.dificultadDeCuidado,
        createPlantaDto.estacion,
        createPlantaDto.fertilizantesSugeridos,
        createPlantaDto.sustratosSugeridos
    );

    this.plantas.push(crePlanta);
    return crePlanta;
}
 

  findAll() {
    return this.plantas;
  }

  findOne(id: number) {
    const plantaEncontrada = this.plantas.find(prod=>prod.idProducto === id);
    
    if(plantaEncontrada){
      return plantaEncontrada;
    }
    return  null;
  }
 
}
