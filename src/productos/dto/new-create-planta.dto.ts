import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  IsInt,
  IsEnum,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';

export class NewCreatePlantaDto {
  @ApiProperty({
    description: 'Nombre común de la planta',
    example: 'Monstera Deliciosa',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nombrePlanta: string;

  @ApiProperty({
    description: 'Nombre científico de la planta',
    example: 'Monstera deliciosa',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nombreCientifico: string;

  @ApiProperty({
    description:
      'ID del hábitat de la planta:\n' +
      '- 1: Interior\n' +
      '- 2: Exterior\n' +
      '- 3: Interior/Exterior',
    example: 1,
    enum: [1, 2, 3],
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsEnum([1, 2, 3])
  habitat: number;

  @ApiProperty({
    description:
      'ID del tipo de luz requerida:\n' +
      '- 1: Luz directa\n' +
      '- 2: Luz indirecta brillante\n' +
      '- 3: Luz indirecta media\n' +
      '- 4: Sombra',
    example: 2,
    enum: [1, 2, 3, 4],
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsEnum([1, 2, 3, 4])
  luz: number;

  @ApiProperty({
    description:
      'ID de la frecuencia de riego:\n' +
      '- 1: Diario\n' +
      '- 2: Cada 2-3 días\n' +
      '- 3: Semanal\n' +
      '- 4: Quincenal',
    example: 2,
    enum: [1, 2, 3, 4],
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsEnum([1, 2, 3, 4])
  frecuenciaDeRiego: number;

  @ApiProperty({
    description:
      'ID del nivel de humedad ideal:\n' +
      '- 1: Alta\n' +
      '- 2: Media\n' +
      '- 3: Baja',
    example: 2,
    enum: [1, 2, 3],
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsEnum([1, 2, 3])
  humedadIdeal: number;

  @ApiProperty({
    description: 'Temperatura ideal para la planta en grados Celsius',
    example: '25°C',
    required: true,
  })
  @IsString()
  temperaturaIdeal: string;

  @ApiProperty({
    description:
      'Indica si la planta es tóxica para mascotas:\n' +
      '- 0: No tóxica\n' +
      '- 1: Tóxica',
    example: 1,
    enum: [0, 1],
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsEnum([0, 1])
  toxicidadMascotas: number;

  @ApiProperty({
    description: 'Tamaño máximo que puede alcanzar la planta en cms',
    example: '120',
    required: true,
  })
  @IsString()
  tamanoMaximo: string;

  @ApiProperty({
    description: 'Peso aproximado de la planta en kilogramos',
    example: '5',
    required: true,
  })
  @IsString()
  peso: string;

  @ApiProperty({
    description:
      'ID del nivel de dificultad de cuidado:\n' +
      '- 1: Fácil\n' +
      '- 2: Moderado\n' +
      '- 3: Difícil',
    example: 1,
    enum: [1, 2, 3],
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsEnum([1, 2, 3])
  dificultadDeCuidado: number;

  @ApiProperty({
    description:
      'IDs de las estaciones recomendadas:\n' +
      '- 1: Primavera\n' +
      '- 2: Verano\n' +
      '- 3: Otoño\n' +
      '- 4: Invierno',
    default: 1,
    example: [1],
    type: 'array',
    //isArray: true,
    required: false,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => parseInt(v));
    return [parseInt(value)];
  })
  @IsArray()
  @IsInt({ each: true })
  @IsEnum([1, 2, 3, 4], { each: true })
  @IsOptional()
  estacion?: number[] = [];

  @ApiProperty({
    description: 'IDs de los fertilizantes sugeridos para la planta',
    example: [1],
    default: [1],
    type: 'array',
    //isArray: true,
    required: false,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => parseInt(v));
    return [parseInt(value)];
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  fertilizantesSugeridos?: number[];

  @ApiProperty({
    description: 'IDs de los sustratos recomendados para la planta',
    example: [1],
    default: [1],
    type: 'array',
    //isArray: true,
    required: false,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => parseInt(v));
    return [parseInt(value)];
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  sustratosSugeridos?: number[];

  @ApiProperty({
    description:
      'IDs de los tipos de suelo adecuados:\n' +
      '- 1: Arcilloso\n' +
      '- 2: Arenoso\n' +
      '- 3: Franco\n' +
      '- 4: Limoso',
    example: [1],
    default: [1],
    type: 'array',
    //isArray: true,
    required: false,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => parseInt(v));
    return [parseInt(value)];
  })
  @IsArray()
  @IsInt({ each: true })
  @IsEnum([1, 2, 3, 4], { each: true })
  @IsOptional()
  tipoSuelo?: number[];

  @ApiProperty({
    description: 'Precio actual de venta de la planta',
    example: 29990,
    minimum: 0,
    required: true,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({
    description: 'Precio normal de la planta sin descuento',
    example: 29990,
    minimum: 0,
    required: true,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  precioNormal: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 10,
    minimum: 0,
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Estado del producto:\n' + '- 0: Inactivo\n' + '- 1: Activo',
    example: 1,
    enum: [0, 1],
    default: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsEnum([0, 1])
  @IsOptional()
  activo?: number = 1;

  @ApiProperty({
    description: 'Imágenes de la planta (máximo 10 archivos)',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
    maxItems: 10,
  })
  @IsOptional()
  imagenes?: Express.Multer.File[];
}
