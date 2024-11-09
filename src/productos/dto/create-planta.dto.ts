import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsDecimal,
} from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

export class CreatePlantaDto extends CreateProductoDto {
  @ApiProperty({
    description: 'Nombre de la planta',
    example: 'Ficus',
  })
  @IsString()
  @IsNotEmpty()
  nombrePlanta: string;

  @ApiProperty({
    description: 'Nombre científico de la planta',
    example: 'Ficus benjamina',
  })
  @IsString()
  @IsOptional()
  nombreCientifico?: string;

  @ApiProperty({
    description: 'ID del hábitat',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  habitat: number;

  @ApiProperty({
    description: 'ID de la luz requerida',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  luz: number;

  @ApiProperty({
    description: 'ID del nivel de humedad',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  humedadIdeal: number;

  @ApiProperty({
    description: 'Temperatura ideal',
    example: 22.5,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'La temperatura ideal debe ser un número decimal con hasta 2 decimales.',
    },
  )
  @IsOptional()
  temperaturaIdeal?: number;

  @ApiProperty({
    description: 'Toxicidad para mascotas',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  toxicidadMascotas?: number;

  @ApiProperty({
    description: 'Tamaño máximo',
    example: 150,
  })
  @IsNumber()
  @IsOptional()
  tamanoMaximo?: number;

  @ApiProperty({
    description: 'Peso',
    example: 500,
  })
  @IsNumber()
  @IsOptional()
  peso?: number;

  @ApiProperty({
    description: 'ID de la dificultad de cuidado',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  dificultadDeCuidado: number;

  @ApiProperty({
    description: 'ID de la frecuencia de riego',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  frecuenciaDeRiego: number;

  @ApiProperty({
    description: 'IDs de los fertilizantes sugeridos',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  fertilizantesSugeridos?: number[];

  @ApiProperty({
    description: 'IDs de los sustratos sugeridos',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  sustratosSugeridos?: number[];

  @ApiProperty({
    description: 'IDs de las estaciones',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  estacion?: number[];

  @ApiProperty({
    description: 'IDs de los tipos de suelo',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tipoSuelo?: number[];
}
