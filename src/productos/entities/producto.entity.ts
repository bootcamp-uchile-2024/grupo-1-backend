import { ApiProperty } from '@nestjs/swagger';
import {
  Estacion,
  Categoria,
  DificultadDeCuidado,
  TipoDeSuelo,
  NivelDeHumedad,
  FrecuenciaDeRiego,
  TamanoDePlanta,
  TipoProducto,
} from './enum-productos';

export class CreateProductoDto {
  @ApiProperty({
    name: 'id',
    example: 1,
  })
  public id: number;
  @ApiProperty({
    description: 'Nombre común de la planta',
    example: 'Rosa',
  })
  public nombrecomun: string;

  @ApiProperty({
    description: 'Nombre científico de la planta',
    example: 'Rosa rubiginosa',
  })
  public nombrecientifico: string;

  @ApiProperty({
    description: 'Tamaño de la planta',
    example: TamanoDePlanta.MEDIANO,
    enum: TamanoDePlanta,
  })
  public tamano: TamanoDePlanta;

  @ApiProperty({
    description: 'Cantidad de luz requerida',
    example: 'Alta',
  })
  public luzrequerida: string;

  @ApiProperty({
    description: 'Frecuencia de riego',
    example: FrecuenciaDeRiego.SEMANAL,
    enum: FrecuenciaDeRiego,
  })
  public frecuenciaderiego: FrecuenciaDeRiego;

  @ApiProperty({
    description: 'Nivel de humedad ideal',
    example: NivelDeHumedad.ALTA,
    enum: NivelDeHumedad,
  })
  public humedadideal: NivelDeHumedad;

  @ApiProperty({
    description: 'Tipo de suelo',
    example: TipoDeSuelo.ARENOSO,
    enum: TipoDeSuelo,
  })
  public tiposuelo: TipoDeSuelo;

  @ApiProperty({
    description: 'Dificultad de cuidado',
    example: DificultadDeCuidado.BAJA,
    enum: DificultadDeCuidado,
  })
  public dificultaddecuidado: DificultadDeCuidado;

  @ApiProperty({
    description: 'Cantidad de stock disponible',
    example: 100,
  })
  public stock: number;

  @ApiProperty({
    description: 'Precio del producto',
    example: 50000,
  })
  public precio: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'http://example.com/imagen.jpg',
  })
  public imagen: string;
  @ApiProperty({
    name: 'estacion',
    example: 'Primavera',
  })
  public estacion: Estacion;
  @ApiProperty({
    name: 'categoria',
    example: 'Interior',
  })
  public categoria: Categoria;
  @ApiProperty({
    name: 'unidadesvendidas',
    example: 100,
  })
  public unidadesvendidas: number;
  @ApiProperty({
    name: 'valoracion',
    default: 4.5,
  })
  public valoracion: number;
  @ApiProperty({
    name: 'tipo',
    default: TipoProducto.PLANTA,
  })
  public tipo: TipoProducto;
}
