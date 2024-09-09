import { ApiProperty } from "@nestjs/swagger";
import { Producto } from "src/productos/entities/producto.entity";
import { DificultadDeCuidado, Estacion, FrecuenciaDeRiego, Habitat, LuzRequerida, NivelDeHumedad, TipoDeSuelo } from "./enum-plantas";
import { Fertilizante } from "src/fertilizantes/entities/fertilizante.entity";
import { Sustrato } from "src/sustratos/entities/sustrato.entity";
import { PlantaCuidado } from "src/planta-cuidados/entities/planta-cuidado.entity";
export class Planta extends Producto {
  
  @ApiProperty({
    name: 'habitat',
    enum: Habitat,
    example: Habitat.CUALQUIERA,
  })
  public habitat: Habitat;

  @ApiProperty({
    name: 'Cantidad de luz requerida',
    enum: LuzRequerida,
    example: LuzRequerida.ALTA,
  })
  public luz: LuzRequerida;

  @ApiProperty({
    description: 'Frecuencia de riego',
    enum: FrecuenciaDeRiego,
    example: FrecuenciaDeRiego.SEMANAL,
  })
  public frecuenciaDeRiego: FrecuenciaDeRiego;

  @ApiProperty({
    description: 'Nivel de humedad ideal',
    enum: NivelDeHumedad,
    example: NivelDeHumedad.ALTA,
  })
  public humedadIdeal: NivelDeHumedad;

  @ApiProperty({
    description: 'Temperatura Ideal en Grados Celcius',
    example: 25,
  })
  public temperaturaIdeal: number;

  @ApiProperty({
    description: 'Toxicidad para Mascotas',
    example: true,
  })
  public toxicidadMascotas: boolean;

  @ApiProperty({
    description: 'Tamaño Máximo Planta en centimetros',
    example: 80
  })
  public tamanoMaximo: number;

  @ApiProperty({
    description: 'Tipo de suelo',
    enum: TipoDeSuelo,
    example: TipoDeSuelo.ARENOSO,
  })
  public tipoSuelo: TipoDeSuelo;

  @ApiProperty({
    description: 'Dificultad de cuidado',
    enum: DificultadDeCuidado,
    example: DificultadDeCuidado.BAJA,
  })
  public dificultadDeCuidado: DificultadDeCuidado;

  @ApiProperty({
    description: 'Estación de mayor crecimiento',
    enum: Estacion,
    example: Estacion.PRIMAVERA,
  })
  public estacion: Estacion;

  @ApiProperty({
    isArray: true,
    description: 'Lista de Id Fertilizantes Sugeridos',
    example: [2],
    default: null
  })
  public fertilizantesSugeridos: number[];

  @ApiProperty({
    isArray: true,
    description: 'Lista de Id Sustratos Sugeridos',
    example: [3],
    default: null
  })
  public sustratosSugeridos: number[];
}
