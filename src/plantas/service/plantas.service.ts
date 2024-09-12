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
        12,
        'Cactus Opuntia',
        [
          'https://cdn2.stylecraze.com/wp-content/uploads/2014/10/10-Different-Types-Of-Cactus-Plants.jpg',
        ],
        10,
        8360,
        ['Arica a Pta.Arenas'],
        10,
        'Es un cactus firme y decorativo.',
        TipoProductos.Planta,
        4,
        150,
        'PL01',
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
        [
          'https://lepotit.cl/cdn/shop/products/SansevieriaMAutorreganteSblanco_860x.jpg?v=1633118960',
        ],
        12,
        12900,
        ['Arica a Pta.Arenas'],
        55,
        'Es una planta de interior popular.',
        TipoProductos.Planta,
        1,
        100,
        'PL02',
        Habitat.INTERIOR,
        LuzRequerida.ALTA,
        FrecuenciaDeRiego.MENSUAL,
        NivelDeHumedad.BAJA,
        18,
        true,
        150,
        TipoDeSuelo.ARCILLOSO,
        DificultadDeCuidado.BAJA,
        Estacion.PRIMAVERA,
        [],
        [],
      ),
      new Planta(
        14,
        'Lirio de Agua',
        [
          'https://acdn.mitiendanube.com/stores/001/202/679/products/231-ad700e1f90d14e71ed16246336798562-1024-1024.webp',
        ],
        20,
        8360,
        ['Arica a Pta.Arenas'],
        12,
        'Es una planta acuática decorativa.',
        TipoProductos.Planta,
        4,
        120,
        'PL03',
        Habitat.INTERIOR,
        LuzRequerida.MEDIA,
        FrecuenciaDeRiego.MENSUAL,
        NivelDeHumedad.MEDIA,
        22,
        false,
        200,
        TipoDeSuelo.ARCILLOSO,
        DificultadDeCuidado.MEDIA,
        Estacion.VERANO,
        [],
        [],
      ),
      new Planta(
        15,
        'Monstera deliciosa',
        [
          'https://www.kenaz.cl/cdn/shop/products/monstera-946603.jpg?v=1718161088&width=600',
        ],
        17,
        7456,
        ['Arica a Pta.Arenas'],
        10,
        'Es una planta tropical ideal para interiores.',
        TipoProductos.Planta,
        3,
        130,
        'PL04',
        Habitat.INTERIOR,
        LuzRequerida.MEDIA,
        FrecuenciaDeRiego.SEMANAL,
        NivelDeHumedad.ALTA,
        25,
        true,
        180,
        TipoDeSuelo.TURBA,
        DificultadDeCuidado.MEDIA,
        Estacion.OTONO,
        [],
        [],
      ),
      new Planta(
        16,
        'Helecho',
        [
          'https://cdnx.jumpseller.com/mentaconcept/image/41835179/resize/480/480?1699388964',
        ],
        18,
        9000,
        ['Arica a Pta.Arenas'],
        32,
        'Es una planta común en ambientes húmedos.',
        TipoProductos.Planta,
        2,
        180,
        'PL05',
        Habitat.INTERIOR,
        LuzRequerida.MEDIA,
        FrecuenciaDeRiego.SEMANAL,
        NivelDeHumedad.ALTA,
        23,
        false,
        300,
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
          'https://viverolosaromos.com/wp-content/uploads/2023/11/EXALTATA-HELECHO-510x510.webp',
        ],
        22,
        5779,
        ['Arica a Pta.Arenas'],
        20,
        'Es una planta popular de gran tamaño.',
        TipoProductos.Planta,
        5,
        300,
        'PL06',
        Habitat.INTERIOR,
        LuzRequerida.MEDIA,
        FrecuenciaDeRiego.SEMANAL,
        NivelDeHumedad.MEDIA,
        20,
        false,
        400,
        TipoDeSuelo.LIMOSO,
        DificultadDeCuidado.MEDIA,
        Estacion.PRIMAVERA,
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
