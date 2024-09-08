import { ApiProperty } from '@nestjs/swagger';
import { Producto } from 'src/productos/entities/producto.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export class Venta {
  @ApiProperty({
    name: 'idventa',
    example: 1,
  })
  public idventa: number;
  @ApiProperty({
    description: 'Productos de la venta',
 //  example: [new Producto()],
    type: [Producto],
  })
  public idproducto: Producto[];
  @ApiProperty({
    description: 'Cantidad de productos',
    example: 1,
  })
  public cantidad: number[];
  @ApiProperty({
    description: 'Total de la venta',
    example: 100000,
  })
  public total: number;
  @ApiProperty({
    description: 'Fecha de la venta',
    example: new Date(),
  })
  public fecha: Date;
  @ApiProperty({
    description: 'Descuento de la venta',
    example: 10000,
  })
  public totaldescto: number;
  @ApiProperty({
    description: 'Cliente que realiza la compra',
    example: new Usuario(),
    type: Usuario,
  })
  public rutcliente: Usuario;
  @ApiProperty({
    description: 'Estado de la venta',
    example: 'Pendiente',
  })
  public estado: string;
}
