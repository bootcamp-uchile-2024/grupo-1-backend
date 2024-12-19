import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProd2Dto {
  @ApiProperty({
    name: 'nombreProducto',
    description: 'Nombre del Producto',
    example: 'Girasol',
    required: true,
    type: 'string',
    maxLength: 255,
    nullable: false,
  })
  ////@IsString({ message: 'El nombre producto debe ser texto' })
  //@IsNotEmpty({ message: 'El nombre producto es campo obligatorio' })
  //@MaxLength(255, {
  //  message: 'El nombre del producto no puede tener más de 255 caracteres',
  //})
  public nombreProducto: string;
  @ApiProperty({
    description: 'Lista de imágenes del producto',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  imagenes: any[];
  // @ApiProperty({
  //   description: 'Lista de imágenes del producto',
  //   type: 'string',
  //   format: 'binary',
  //   isArray: true,
  // })
  //@IsArray({ message: 'El campo debe ser un array de URLs' })
  //@ArrayNotEmpty({ message: 'La lista de URLs no puede estar vacía' })
  //@IsUrl({}, { each: true, message: 'Cada URL debe ser válida' })
  //  public imagenProducto: string[];

  @ApiProperty({
    name: 'descuento',
    type: Number,
    description: 'Descuento en el precio del producto',
    required: false,
    minimum: 0,
    example: 0,
    default: 0,
  })
  //@IsNumber({}, { message: 'El descuento debe ser un número' })
  //@Min(0, { message: 'El descuento debe ser al menos 0' })
  public descuento?: number;

  @ApiProperty({
    name: 'precioNormal',
    type: Number,
    description: 'Precio normal del producto sin descuento',
    example: 50000,
    required: true,
    minimum: 100,
    maximum: 1000000,
  })
  //@IsNumber({}, { message: 'El precio normal debe ser un número' })
  //@Min(100, {
  //   message: 'El precio normal del producto debe ser al menos 100',
  // })
  //@Max(1000000, {
  //  message: 'El precio normal del producto debe ser como máximo 1000000',
  //})
  public precioNormal: number;

  @ApiProperty({
    name: 'stock',
    type: Number,
    description: 'Stock del producto',
    example: 100,
    required: true,
    minimum: 0,
  })
  //@IsNumber({}, { message: 'El stock debe ser un número' })
  //@Min(0, { message: 'El stock debe ser al menos 0' })
  public stock: number;

  @ApiProperty({
    name: 'descripcionProducto',
    description: 'Descripción del producto',
    example: 'descripcion del producto ',
    required: false,
    type: 'string',
    maxLength: 255,
  })
  //@IsString({ message: 'La descripción del producto debe ser texto' })
  //@MaxLength(255, {
  //   message: 'La descripción del producto no puede tener más de 255 caracteres',
  // })
  public descripcionProducto?: string;

  @ApiProperty({
    name: 'idCategoria',
    description: 'ID de la categoría del producto',
    example: 1,
    required: true,
    type: 'number',
    default: 1,
  })
  //@IsNumber({}, { message: 'El ID de la categoría debe ser un número' })
  //@IsNotEmpty({ message: 'El ID de la categoría es campo obligatorio' })
  public idCategoria: number;
  @ApiProperty({
    name: 'activo',
    type: Number,
    description: 'producto activo',
    example: 1,
    required: true,
    minimum: 0,
    default: 1,
  })
  //@IsNumber({}, { message: 'El indicador activo debe ser numero' })
  //@Min(0, { message: 'El indicador activo  es 0 o 1' })
  //@Max(1, { message: 'El indicador activo  es 0 o 1' })
  public activo: number;
}
