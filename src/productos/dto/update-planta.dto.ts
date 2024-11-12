import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePlantaDto } from './create-planta.dto';
import { IsOptional } from 'class-validator';

export class UpdatePlantaDto extends PartialType(CreatePlantaDto) {
  @ApiProperty({
    description: 'Nombre de la planta',
    example: 'Ficus',
  })
  @IsOptional()
  nombrePlanta?: string;

  @ApiProperty({
    description: 'Nombre científico de la planta',
    example: 'Ficus benjamina',
  })
  @IsOptional()
  nombreCientifico?: string;

  @ApiProperty({
    description: 'ID del hábitat',
    example: 1,
  })
  @IsOptional()
  habitat?: number;

  @ApiProperty({
    description: 'ID de la luz requerida',
    example: 1,
  })
  @IsOptional()
  luz?: number;

  @ApiProperty({
    description: 'ID del nivel de humedad',
    example: 1,
  })
  @IsOptional()
  humedadIdeal?: number;

  @ApiProperty({
    description: 'Temperatura ideal',
    example: 22.5,
  })
  @IsOptional()
  temperaturaIdeal?: number;

  @ApiProperty({
    description: 'Toxicidad para mascotas',
    example: 1,
  })
  @IsOptional()
  toxicidadMascotas?: number;

  @ApiProperty({
    description: 'Tamaño máximo',
    example: 150,
  })
  @IsOptional()
  tamanoMaximo?: number;

  @ApiProperty({
    description: 'Peso',
    example: 500,
  })
  @IsOptional()
  peso?: number;

  @ApiProperty({
    description: 'ID de la dificultad de cuidado',
    example: 1,
  })
  @IsOptional()
  dificultadDeCuidado?: number;

  @ApiProperty({
    description: 'ID de la frecuencia de riego',
    example: 1,
  })
  @IsOptional()
  frecuenciaDeRiego?: number;

  @ApiProperty({
    description: 'IDs de los fertilizantes sugeridos',
    example: [1, 2],
  })
  @IsOptional()
  fertilizantesSugeridos?: number[];

  @ApiProperty({
    description: 'IDs de los sustratos sugeridos',
    example: [1, 2],
  })
  @IsOptional()
  sustratosSugeridos?: number[];

  @ApiProperty({
    description: 'IDs de las estaciones',
    example: [1, 2],
  })
  @IsOptional()
  estacion?: number[];

  @ApiProperty({
    description: 'IDs de los tipos de suelo',
    example: [1, 2],
  })
  @IsOptional()
  tipoSuelo?: number[];
}
