import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsDecimal,
  IsArray,
} from 'class-validator';
import { TipoDeSuelo } from '../entities/tipo_de_suelo.entity'; // Ajusta esta importación a tu proyecto
import { Estacion } from '../entities/estacion.entity';
import { Fertilizante } from '../entities/fertilizante.entity';
import { Sustrato } from '../entities/sustrato.entity';

export class PlantaDto {
  @ApiProperty({ description: 'Nombre de la planta', example: 'Cactus' })
  @IsString()
  nombrePlanta: string;

  @ApiProperty({
    description: 'Nombre científico de la planta',
    example: 'Cactaceae',
  })
  @IsString()
  @IsOptional()
  nombreCientifico?: string;

  @ApiProperty({
    description: 'Tamaño máximo de la planta en cm',
    example: 80,
    required: false,
  })
  @IsInt()
  @IsOptional()
  tamanoMaximo?: number;

  @ApiProperty({
    description: 'Peso de la planta en kg',
    example: 1.5,
    required: false,
  })
  @IsDecimal()
  @IsOptional()
  peso?: number;

  @ApiProperty({
    description: 'Temperatura ideal para el crecimiento de la planta',
    example: 25.5,
    required: false,
  })
  @IsDecimal()
  @IsOptional()
  temperaturaIdeal?: number;

  @ApiProperty({
    description: 'Toxicidad para mascotas',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  toxicidadMascotas?: number;

  @ApiProperty({
    description: 'Lista de fertilizantes sugeridos',
    type: [Fertilizante],
    required: false,
  })
  @IsArray()
  @IsOptional()
  fertilizantesSugeridos?: Fertilizante[];

  @ApiProperty({
    description: 'Lista de sustratos sugeridos',
    type: [Sustrato],
    required: false,
  })
  @IsArray()
  @IsOptional()
  sustratosSugeridos?: Sustrato[];

  @ApiProperty({
    description: 'Lista de estaciones recomendadas para la planta',
    type: [Estacion],
    required: false,
  })
  @IsArray()
  @IsOptional()
  estaciones?: Estacion[];

  @ApiProperty({
    description: 'Tipo de suelo recomendado para la planta',
    type: [TipoDeSuelo],
    required: false,
  })
  @IsArray()
  @IsOptional()
  suelos?: TipoDeSuelo[];
}
