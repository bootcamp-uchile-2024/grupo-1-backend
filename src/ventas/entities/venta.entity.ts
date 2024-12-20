import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { OrdenCompra } from './orden_compra.entity';
import { FormaPago } from './forma_pago.entity';
import { EstadosVenta } from './estados_venta.entity';
import { Despacho } from 'src/despachos/entities/despacho.entity';

@Entity({ name: 'Venta' })
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  totalBruto: number;

  @Column({ type: 'int' })
  totalDescuento: number;

  @Column({ type: 'int' })
  iva: number;

  @Column({ type: 'int' })
  totalPago: number;
  @Column({ type: 'varchar', length: 255 })
  nroComprobantePago: string;
  @OneToOne(() => OrdenCompra, (ordenCompra) => ordenCompra.venta)
  @JoinColumn({ name: 'idOrdenCompra' })
  ordenCompra: OrdenCompra;
  @ManyToOne(() => FormaPago, (formaPago) => formaPago.ventas)
  @JoinColumn({ name: 'idFormaPago' })
  formaPago: FormaPago;

  @ManyToOne(() => EstadosVenta, (estadoVenta) => estadoVenta.ventas)
  @JoinColumn({ name: 'idEstadoVenta' })
  estadoVenta: EstadosVenta;

  @OneToOne(() => Despacho, (despacho) => despacho.venta)
  despacho: Despacho;
}
