import { Injectable } from '@nestjs/common';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';
import { Planta } from './entities/planta.entity';
import { TipoProductos } from 'src/productos/entities/enum-productos';
import { DificultadDeCuidado, Estacion, FrecuenciaDeRiego, Habitat, LuzRequerida, NivelDeHumedad, TipoDeSuelo } from './entities/enum-plantas';

@Injectable()
export class PlantasService {

  constructor()
  {
    /*let ventasPlantas: VerPlantas = new VerPlantas();
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
    
    this.catalogo.push(catalogo3);*/
  }

   plantas: Planta[] = [
    new Planta(
        9, 
        'Planta de Interior Verde', 
        ['http://lugar.com/imagen_p1.png'], 
        5, 
        3000, 
        ['Arica a Pta.Arenas'], 
        20, 
        'Planta ideal para interiores con poca luz.', 
        TipoProductos.Planta, 
        4, 
        150, 
        'PL1', 
        Habitat.INTERIOR, 
        LuzRequerida.BAJA, 
        FrecuenciaDeRiego.SEMANAL, 
        NivelDeHumedad.MEDIA, 
        22, 
        false, 
        50, 
        TipoDeSuelo.ARENOSO, 
        DificultadDeCuidado.MEDIA, 
        Estacion.PRIMAVERA, 
        [1, 3], 
        [2, 4]
    ),
    new Planta(
        10, 
        'Sombra de Jardín', 
        ['http://lugar.com/imagen_p2.png'], 
        10, 
        1500, 
        ['Arica a Pta.Arenas'], 
        30, 
        'Perfecta para dar sombra en jardines grandes.', 
        TipoProductos.Planta, 
        5, 
        200, 
        'PL2', 
        Habitat.EXTERIOR, 
        LuzRequerida.MEDIA, 
        FrecuenciaDeRiego.DIARIO, 
        NivelDeHumedad.ALTA, 
        18, 
        true, 
        80, 
        TipoDeSuelo.TURBA, 
        DificultadDeCuidado.BAJA, 
        Estacion.VERANO, 
        [2, 5], 
        [1, 6]
    ),
    new Planta(
        11, 
        'Cactus Decorativo', 
        ['http://lugar.com/imagen_p3.png'], 
        0, 
        500, 
        ['Arica a Pta.Arenas'], 
        15, 
        'Cactus pequeño ideal para decoración de interiores.', 
        TipoProductos.Planta, 
        3, 
        1000, 
        'PL3', 
        Habitat.INTERIOR, 
        LuzRequerida.ALTA, 
        FrecuenciaDeRiego.MENSUAL, 
        NivelDeHumedad.BAJA, 
        25, 
        false, 
        20, 
        TipoDeSuelo.ARENOSO, 
        DificultadDeCuidado.ALTA, 
        Estacion.PRIMAVERA, 
        [1], 
        [2]
    )
];




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




























  
  /*listaPlantasMasVendidas() {
    return this.masVendidos;
  }*/

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

  update(id: number, updatePlantaDto: UpdatePlantaDto) {
    return `This action updates a #${id} planta`;
  }

  remove(id: number) {
    return `This action removes a #${id} planta`;
  }
}
