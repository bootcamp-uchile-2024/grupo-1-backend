import { ApiProperty } from '@nestjs/swagger';
export class CreateVentaDto {
  @ApiProperty({
    description: 'id Orden Compra',
    example: 1,
  })
  public idOrden: number;
  @ApiProperty({
    description: 'Idenficador Comprobante Pago',
    example: 'O125250004-1425',
  })
  public nroComprobantePago: string;
  @ApiProperty({
    description: 'Forma de Pago ',
    example: 1,
  })
  public idFormaPago: number;
}
