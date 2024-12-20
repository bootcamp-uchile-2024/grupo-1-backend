import { ApiProperty } from '@nestjs/swagger';
export class GetVentaDto {
  id: number;
  totalBruto: number;
  iva: number;
  totalPago: number;
  nroComprobantePago: string;

  idOrdenCompra: number;

  idFormaPago: number;

  idEstadoVenta: number;
}
