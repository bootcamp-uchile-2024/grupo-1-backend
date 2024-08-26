import { ApiProperty } from "@nestjs/swagger";
import { CreateProductoDto } from "src/productos/dto/create-producto.dto";
import { DificultadDeCuidado, Estacion, FrecuenciaDeRiego, Habitad, LuzRequerida, NivelDeHumedad, TipoDeSuelo } from "../entities/enum-plantas";


export class CreatePlantaDto extends CreateProductoDto {

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
    description: 'Temperatura Ideal en Grados Celcius',
    example: 25,
  })
  public temperaturaIdeal: number;
  @ApiProperty({
    description: 'Toxicidad para Mascotas',
    example: 'True',
  })
  public toxicidadMascotas: boolean;
  @ApiProperty({
    description: 'Ambiente donde viven ',
    example: Habitad.CUALQUIERA,
    enum: Habitad,
  })
  public Habitad: Habitad;
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
    description: 'Estacion',
    example: Estacion.PRIMAVERA,
    enum: Estacion,
  })
  public estacion: Estacion;
  @ApiProperty({
    isArray: true,
    description: 'Lista de Id Fertiliantes',
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
