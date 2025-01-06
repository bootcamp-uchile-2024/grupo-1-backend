import { ApiProperty } from '@nestjs/swagger';

export enum CategoriaProducto {
  PLANTAS = 1,
  CONTROL_PLAGAS = 2,
  MACETEROS = 3,
  SUSTRATOS = 4,
  FERTILIZANTES = 5,
}

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
  public nombreProducto: string;

  @ApiProperty({
    description: 'Lista de imágenes del producto',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  imagenes: any[];

  @ApiProperty({
    name: 'descuento',
    type: Number,
    description: 'Descuento en el precio del producto',
    required: false,
    minimum: 0,
    example: 0,
    default: 0,
  })
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
  public precioNormal: number;

  @ApiProperty({
    name: 'stock',
    type: Number,
    description: 'Stock del producto',
    example: 100,
    required: true,
    minimum: 0,
  })
  public stock: number;

  @ApiProperty({
    name: 'descripcionProducto',
    description: 'Descripción del producto',
    example: 'descripcion del producto ',
    required: false,
    type: 'string',
    maxLength: 255,
  })
  public descripcionProducto?: string;

  @ApiProperty({
    name: 'idCategoria',
    description:
      'ID de la categoría:\n\n' +
      '- 1: PLANTAS\n' +
      '- 2: CONTROL DE PLAGAS\n' +
      '- 3: MACETEROS\n' +
      '- 4: SUSTRATOS\n' +
      '- 5: FERTILIZANTES',
    enum: CategoriaProducto,
    example: CategoriaProducto.PLANTAS,
    required: true,
    enumName: 'CategoriaProducto',
  })
  public idCategoria: CategoriaProducto;

  @ApiProperty({
    name: 'activo',
    type: Number,
    description: 'Estado del producto:\n\n' + '- 0: INACTIVO\n' + '- 1: ACTIVO',
    example: 1,
    required: true,
    minimum: 0,
    default: 1,
  })
  public activo: number;

  @ApiProperty({
    name: 'valoracion',
    type: Number,
    description: 'Valoración promedio del producto',
    required: false,
    minimum: 0,
    maximum: 5,
    example: 0,
    nullable: true,
  })
  public valoracion?: number;

  @ApiProperty({
    name: 'cantidadVentas',
    type: Number,
    description: 'Cantidad total de ventas del producto',
    required: false,
    minimum: 0,
    example: 0,
    nullable: true,
  })
  public cantidadVentas?: number;
}
