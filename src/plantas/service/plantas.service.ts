import { Injectable } from '@nestjs/common';
import { TipoProductos } from 'src/productos/entities/enum-productos';
import {
  DificultadDeCuidado,
  Estacion,
  FrecuenciaDeRiego,
  Habitat,
  LuzRequerida,
  NivelDeHumedad,
  TipoDeSuelo,
} from '../entities/enum-plantas';
import { Planta } from '../entities/planta.entity';
import { CreatePlantaDto } from '../dto/create-planta.dto';

@Injectable()
export class PlantasService {
  plantas: Planta[] = [];
  constructor() {
    this.plantas = [
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
        [12, 13],
        [16],
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
        [12],
        [16, 17],
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
        [13],
        [17, 18],
      ),
      new Planta(
        12,
        'Cactus Decorativo',
        [
          'https://cdn2.stylecraze.com/wp-content/uploads/2014/10/10-Different-Types-Of-Cactus-Plants.jpg',
        ],
        10,
        58360,
        ['Arica a Pta.Arenas'],
        10,
        'Es un cactus firme y decorativo.',
        TipoProductos.Planta,
        4,
        150,
        'PL04',
        Habitat.INTERIOR,
        LuzRequerida.ALTA,
        FrecuenciaDeRiego.MENSUAL,
        NivelDeHumedad.BAJA,
        20,
        false,
        150,
        TipoDeSuelo.ARENOSO,
        DificultadDeCuidado.BAJA,
        Estacion.PRIMAVERA,
        [],
        [],
      ),

      new Planta(
        13,
        'Lengua de Suegra',
        ['https://images.unsplash.com/photo-1547298919-c4a2ab7f5c38'],
        35,
        531600,
        ['Arica a Pta.Arenas'],
        20,
        'Es una planta interior resistente, perfecta para zonas de baja iluminación.',
        TipoProductos.Planta,
        5,
        180,
        'PL05',
        Habitat.INTERIOR,
        LuzRequerida.BAJA,
        FrecuenciaDeRiego.MENSUAL,
        NivelDeHumedad.BAJA,
        18,
        true,
        90,
        TipoDeSuelo.ARENOSO,
        DificultadDeCuidado.BAJA,
        Estacion.INVIERNO,
        [],
        [],
      ),

      new Planta(
        14,
        'Monstera',
        [
          'https://www.ikea.com/cl/es/images/products/monstera-deliciosa__0735561_pe740932_s5.jpg',
        ],
        15,
        594500,
        ['Arica a Pta.Arenas'],
        15,
        'Es una planta ornamental tropical ideal para espacios amplios.',
        TipoProductos.Planta,
        4,
        200,
        'PL06',
        Habitat.INTERIOR,
        LuzRequerida.ALTA,
        FrecuenciaDeRiego.QUINCENAL,
        NivelDeHumedad.MEDIA,
        24,
        false,
        300,
        TipoDeSuelo.LIMOSO,
        DificultadDeCuidado.MEDIA,
        Estacion.VERANO,
        [],
        [],
      ),

      new Planta(
        15,
        'Lavanda',
        [
          'https://www.wikihow.com/images/thumb/8/82/Propagate-Lavender-Step-3-Version-2.jpg',
        ],
        20,
        591400,
        ['Arica a Pta.Arenas'],
        30,
        'Planta aromática con múltiples beneficios para el hogar.',
        TipoProductos.Planta,
        5,
        250,
        'PL07',
        Habitat.EXTERIOR,
        LuzRequerida.ALTA,
        FrecuenciaDeRiego.SEMANAL,
        NivelDeHumedad.MEDIA,
        24,
        false,
        150,
        TipoDeSuelo.TURBA,
        DificultadDeCuidado.BAJA,
        Estacion.PRIMAVERA,
        [],
        [],
      ),

      new Planta(
        16,
        'Helecho Nephrolepis',
        [
          'https://dutchplantin.com/wp-content/uploads/2016/10/ferns_Nephrolepis.jpg',
        ],
        18,
        532200,
        ['Arica a Pta.Arenas'],
        25,
        'Es un helecho común, perfecto para interiores o exteriores sombreados.',
        TipoProductos.Planta,
        4,
        120,
        'PL08',
        Habitat.EXTERIOR,
        LuzRequerida.MEDIA,
        FrecuenciaDeRiego.QUINCENAL,
        NivelDeHumedad.ALTA,
        18,
        true,
        120,
        TipoDeSuelo.TURBA,
        DificultadDeCuidado.MEDIA,
        Estacion.VERANO,
        [],
        [],
      ),

      new Planta(
        17,
        'Ficus lyrata',
        [
          'https://cdn.shopify.com/s/files/1/0047/9730/0847/products/ficus-lyrata_large.jpg',
        ],
        10,
        61000,
        ['Arica a Pta.Arenas'],
        35,
        'El Ficus es una planta que necesita espacios amplios y luz abundante.',
        TipoProductos.Planta,
        3,
        180,
        'PL09',
        Habitat.INTERIOR,
        LuzRequerida.ALTA,
        FrecuenciaDeRiego.SEMANAL,
        NivelDeHumedad.MEDIA,
        24,
        true,
        250,
        TipoDeSuelo.LIMOSO,
        DificultadDeCuidado.ALTA,
        Estacion.VERANO,
        [],
        [],
      ),
    ];
  }
  obtCantidadPlantas() {
    const cantidadPlantas = this.plantas.length;
    return cantidadPlantas;
  }
  createCodigoPlanta() {
    const numeroCodigo = this.obtCantidadPlantas() + 1;
    const codigoPLanta = 'PL' + numeroCodigo;
    return codigoPLanta;
  }

  create(
    createPlantaDto: CreatePlantaDto,
    idProducto: number,
    codigoProducto: string,
  ) {
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
      createPlantaDto.sustratosSugeridos,
    );

    this.plantas.push(crePlanta);
    return crePlanta;
  }

  findAll() {
    return this.plantas;
  }

  findOne(id: number) {
    const plantaEncontrada = this.plantas.find(
      (prod) => prod.idProducto === id,
    );

    if (plantaEncontrada) {
      return plantaEncontrada;
    }
    return null;
  }
}
