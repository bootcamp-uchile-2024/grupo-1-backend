import { ApiProperty } from '@nestjs/swagger';
import { TipoPlantasRecomendadas } from 'src/fertilizantes/entities/enum-fertilizantes';
import { CreateProductoDto } from 'src/productos/dto/create-producto.dto';
import {
  ComposicionSustrato,
  RetencionHumedad,
  TexturaSustrato,
} from '../entities/enum-sustratos';
import { TipoProductos } from 'src/productos/entities/enum-productos';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class CreateSustratoDto extends CreateProductoDto {
  @ApiProperty({
    description: 'Categoría del producto',
    example: TipoProductos.Sustratos,
    enum: TipoProductos,
  })
  @IsEnum(TipoProductos)
  @IsNotEmpty()
  categoria: TipoProductos.Sustratos;

  @ApiProperty({
    name: 'nombreProducto',
    example: 'Mezcla para plantas de interior con perlita',
    description: 'Nombre del producto',
  })
  @IsString()
  @IsNotEmpty()
  nombreProducto: string;

  @ApiProperty({
    name: 'urlImagen',
    example: 'http://default.com/sustrato1.jpg',
    description: 'URL de la imagen del producto',
  })
  @IsArray()
  @IsUrl({}, { each: true })
  urlImagen: string[];

  @ApiProperty({
    name: 'descripcionProducto',
    example: 'descripcion del producto sustrato',
    description: 'Descripción del producto en stock',
  })
  @IsString()
  @IsNotEmpty()
  descripcionProducto: string;

  @ApiProperty({
    name: 'valorProducto',
    example: 5000,
    description: 'Valor del producto',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  valorProducto: number;

  @ApiProperty({
    name: 'descuento',
    example: 0,
    description: 'Descuento del producto',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  descuento?: number;

  @ApiProperty({
    name: 'valorNormal',
    example: 8000,
    description: 'Valor normal del producto',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorNormal?: number;

  @ApiProperty({
    name: 'composicion',
    example: 'Turba, Perlita',
    description: 'Composición del sustrato',
  })
  @IsArray()
  @IsEnum(ComposicionSustrato, { each: true })
  @IsNotEmpty()
  composicion: ComposicionSustrato[];

  @ApiProperty({
    name: 'textura',
    example: 'Ligero, Aireado',
    description: 'Textura del sustrato',
  })
  @IsArray()
  @IsEnum(TexturaSustrato, { each: true })
  @IsNotEmpty()
  textura: TexturaSustrato[];

  @ApiProperty({
    name: 'retencionDeHumedad',
    example: 'Media',
    description: 'Retención de humedad del sustrato',
  })
  @IsEnum(RetencionHumedad)
  @IsNotEmpty()
  retencionDeHumedad: RetencionHumedad;

  @ApiProperty({
    name: 'drenaje',
    example: 'Bueno',
    description: 'Drenaje del sustrato',
  })
  @IsString()
  @IsNotEmpty()
  drenaje: string;

  @ApiProperty({
    name: 'plantasRecomendadas',
    enum: TipoPlantasRecomendadas,
    example: TipoPlantasRecomendadas.PLANTAS_INTERIOR,
    description: 'Tipo de plantas recomendadas',
  })
  @IsEnum(TipoPlantasRecomendadas)
  @IsNotEmpty()
  plantasRecomendadas: TipoPlantasRecomendadas;

  @ApiProperty({
    name: 'observaciones',
    example:
      'Ideal para plantas de interior que necesitan un buen equilibrio entre retención de humedad y drenaje.',
    description: 'Observaciones del sustrato',
  })
  @IsString()
  @IsOptional()
  observaciones: string;
  codigoProducto: string;
}
