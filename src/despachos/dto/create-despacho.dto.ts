import { ApiProperty } from '@nestjs/swagger';
import { EstadosDespacho } from '../entities/estados_despacho.entity';

export class CreateDespachoDto {
  @ApiProperty({
    description: 'fecha Estimada Entrega',
    example: '30/08/2024',
  })
  public fechaEstimada: Date;
  @ApiProperty({
    name: 'Estado Despacho',
    enum: EstadosDespacho,
  })
  public EstadosDespacho: EstadosDespacho;
  @ApiProperty({
    name: 'Nro Seguimiento',
    example: 152525,
    default: 0,
  })
  public nroSeguimiento: number;
  @ApiProperty({
    name: 'Proveedor Despacho',
    example: 'Blue-Express',
  })
  public proveedorDespacho: string; /*se deberia crear entidaad proveedor */
}
