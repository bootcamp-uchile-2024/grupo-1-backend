/*
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenCompra } from './orden_compra.entity';
import { FormaPago } from './forma_pago.entity';
import { EstadosVenta } from './estados_venta.entity';

@Entity({ name: 'Venta' })
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrdenCompra)
  @JoinColumn({ name: 'idOrdenCompra' })
  ordenCompra: OrdenCompra;

  @Column({ type: 'varchar', length: 10 })
  rutUsuario: string;

  @Column({ type: 'varchar', length: 255 })
  formaIdentificacion: string;

  @Column({ type: 'int' })
  totalBruto: number;

  @Column({ type: 'int' })
  totalDescuento: number;

  @Column({ type: 'int' })
  iva: number;

  @Column({ type: 'int' })
  totalPago: number;

  @ManyToOne(() => FormaPago)
  @JoinColumn({ name: 'idFormaPago' })
  formaPago: FormaPago;

  @Column({ type: 'varchar', length: 255 })
  nroComprobantePago: string;

  @ManyToOne(() => EstadosVenta)
  @JoinColumn({ name: 'idEstadoVenta' })
  estadoVenta: EstadosVenta;
}
*/