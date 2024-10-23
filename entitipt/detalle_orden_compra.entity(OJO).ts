import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenCompra } from './orden_compra.entity';
import { Producto } from './producto.entity';

@Entity({ name: 'DetalleOrdenCompra' })
export class DetalleOrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrdenCompra)
  @JoinColumn({ name: 'idOrdenCompra' })
  ordenCompra: OrdenCompra;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'int' })
  precio: number;

  @Column({ type: 'int' })
  descuento: number;

  @Column({ type: 'int' })
  totalProducto: number;
}
