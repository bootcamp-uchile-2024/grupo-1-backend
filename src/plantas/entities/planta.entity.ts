import { ApiProperty } from "@nestjs/swagger";
import { Producto } from "src/productos/entities/producto.entity";
import { DificultadDeCuidado, Estacion, FrecuenciaDeRiego, Habitad, LuzRequerida, NivelDeHumedad, TipoDeSuelo } from "./enum-plantas";
import { Fertilizante } from "src/fertilizantes/entities/fertilizante.entity";
import { Sustrato } from "src/sustratos/entities/sustrato.entity";

export class Planta extends Producto {
  @ApiProperty({
    name: 'nombreCientifico',
    example: 'Rosa rubiginosa'
  })
  public nombreCientifico: string;

  @ApiProperty({
    name: 'Tamaño Maximo Planta en centimetros',
    example: '80'
  })
  public tamano: number;

  @ApiProperty({
    name: 'Cantidad de luz requerida',
    enum: LuzRequerida, example: LuzRequerida.ALTA,
  })
  public luzrequerida: LuzRequerida;
  @ApiProperty({
    name: 'Frecuencia de riego',
    example: FrecuenciaDeRiego.SEMANAL,
    enum: FrecuenciaDeRiego,
  })
  public frecuenciaderiego: FrecuenciaDeRiego;

  @ApiProperty({
    name: 'Nivel de humedad ideal',
    example: NivelDeHumedad.ALTA,
    enum: NivelDeHumedad,
  })
  public humedadideal: NivelDeHumedad;
  @ApiProperty({
    name: 'Temperatura Ideal en Grados Celcius',
    example: 25,
  })
  public temperaturaIdeal: number;

  @ApiProperty({
    name: 'Toxicidad para Mascotas',
    example: 'True',
  })
  public toxicidadMascotas: boolean;
  @ApiProperty({
    name: 'Ambiente donde viven ',
    example: Habitad.CUALQUIERA,
    enum: Habitad,
  })
  public Habitad: Habitad;
  @ApiProperty({
    name: 'Tipo de suelo',
    example: TipoDeSuelo.ARENOSO,
    enum: TipoDeSuelo,
  })
  public tiposuelo: TipoDeSuelo;

  @ApiProperty({
    name: 'Dificultad de cuidado',
    example: DificultadDeCuidado.BAJA,
    enum: DificultadDeCuidado,
  })
  public dificultaddecuidado: DificultadDeCuidado;
  @ApiProperty({
    name: 'Estacion',
    example: Estacion.PRIMAVERA,
    enum: Estacion,
  })
  public estacion: Estacion;
  public fertilizantesSugeridos: Fertilizante[];
  public sustratosSugeridos: Sustrato[];
  
  //public fertilizantesSugeridos: Fertilizante[];
  //public sustratosSugeridos: Sustrato[];
  /*deberia dejar */
}
