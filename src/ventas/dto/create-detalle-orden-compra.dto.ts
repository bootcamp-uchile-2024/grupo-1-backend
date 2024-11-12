import { ApiProperty } from '@nestjs/swagger';
export class CreateDetalleOrdenCompraDto {
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
  @ApiProperty({
    description: 'Cantidad Compra ',
    example: 2,
  })
  public cantidad: number;
}
