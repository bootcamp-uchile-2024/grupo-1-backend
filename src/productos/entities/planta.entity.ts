import { ApiProperty } from '@nestjs/swagger';
import { Producto } from 'src/productos/entities/producto.entity';
import { FrecuenciaDeRiego } from '../enum/plantas/frecuenciasDeRiego';
import { TipoProductos } from 'src/productos/enum/tipo-productos';
import { LuzRequerida } from 'src/productos/enum/plantas/luzRequerida';
import { Estacion } from 'src/productos/enum/plantas/estaciones';
import { Habitat } from 'src/productos/enum/plantas/habitat';
import { DificultadDeCuidado } from 'src/productos/enum/plantas/dificultadDeCuidado';
import { TipoDeSuelo } from 'src/productos/enum/plantas/tiposDeSuelo';
import { NivelDeHumedad } from 'src/productos/enum/plantas/nivelesDeHumedad';
export class Planta extends Producto {
  @ApiProperty()
  public habitat: Habitat;
  @ApiProperty()
  public luz: LuzRequerida;
  @ApiProperty()
  public frecuenciaDeRiego: FrecuenciaDeRiego;
  @ApiProperty()
  public humedadIdeal: NivelDeHumedad;
  @ApiProperty()
  public temperaturaIdeal: number;
  @ApiProperty()
  public toxicidadMascotas: boolean;
  @ApiProperty()
  public tamanoMaximo: number;
  @ApiProperty()
  public tipoSuelo: TipoDeSuelo;
  @ApiProperty()
  public dificultadDeCuidado: DificultadDeCuidado;
  @ApiProperty()
  public estacion: Estacion;
  @ApiProperty()
  public fertilizantesSugeridos: number[];
  @ApiProperty()
  public sustratosSugeridos: number[];
  constructor(
    idProducto: number,
    nombreProducto: string,
    imagenProducto: string[],
    descuento: number,
    precioNormal: number,
    coberturaDeDespacho: string[],
    stock: number,
    descripcionProducto: string,
    idCategoria: TipoProductos,
    valoracion: number,
    cantidadVentas: number,
    codigoProducto: string,
    habitat: Habitat,
    luz: LuzRequerida,
    frecuenciaDeRiego: FrecuenciaDeRiego,
    humedadIdeal: NivelDeHumedad,
    temperaturaIdeal: number,
    toxicidadMascotas: boolean,
    tamanoMaximo: number,
    tipoSuelo: TipoDeSuelo,
    dificultadDeCuidado: DificultadDeCuidado,
    estacion: Estacion,
    fertilizantesSugeridos: number[],
    sustratosSugeridos: number[],
  ) {
    super(
      idProducto,
      nombreProducto,
      imagenProducto,
      descuento,
      precioNormal,
      coberturaDeDespacho,
      stock,
      descripcionProducto,
      idCategoria,
      valoracion,
      cantidadVentas,
      codigoProducto,
    );
    this.habitat = habitat;
    this.luz = luz;
    this.frecuenciaDeRiego = frecuenciaDeRiego;
    this.humedadIdeal = humedadIdeal;
    this.temperaturaIdeal = temperaturaIdeal;
    this.toxicidadMascotas = toxicidadMascotas;
    this.tamanoMaximo = tamanoMaximo;
    this.tipoSuelo = tipoSuelo;
    this.dificultadDeCuidado = dificultadDeCuidado;
    this.estacion = estacion;
    this.fertilizantesSugeridos = fertilizantesSugeridos;
    this.sustratosSugeridos = sustratosSugeridos;
  }
}