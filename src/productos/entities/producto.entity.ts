import { ApiProperty } from '@nestjs/swagger';
export class Producto {
  @ApiProperty({
    name: 'id',
    example: 1,
  })
  public id: number;
  @ApiProperty({
    description: 'Nombre del Producto',
    example: 'Rosa',
  })
  public nombreProducto: string;
  @ApiProperty({
    description: 'Cantidad de stock disponible',
    example: 100,
  })
  public stock: number;
  @ApiProperty({
    description: 'Precio del producto',
    example: 50000,
  })
  public precio: number;
  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'http://example.com/imagen.jpg',
  })
  public imagen: string;
  @ApiProperty({
    name: 'valoracion',
    default: 4.5,
  })
  public valoracion: number;
  @ApiProperty({
    name: 'cantidad Ventas',
    default: 0,
  })
  public  cantidadVentas: number;
  

}

