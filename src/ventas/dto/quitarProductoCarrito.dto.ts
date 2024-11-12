import { ApiProperty } from '@nestjs/swagger';
export class QuitarProductoCarritoDto {
  @ApiProperty({
    description: 'id Orden Compra',
    example: 1,
  })
  public idOrden: number;
  @ApiProperty({
    description: 'id Producto',
    example: 1,
  })
  public idProducto: number;
}
