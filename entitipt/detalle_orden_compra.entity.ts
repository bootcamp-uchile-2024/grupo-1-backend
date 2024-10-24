import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto.entity';
import { OrdenCompra } from './orden-compra.entity';

@Entity()
export class DetalleOrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrdenCompra, (orden) => orden.detalles)
  @JoinColumn({ name: 'idOrdenCompra' })
  orden: OrdenCompra;

  @ManyToOne(() => Producto, (producto) => producto.detallesOrdenCompra)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column({ type: 'int', nullable: true })
  cantidad: number;

  @Column({ type: 'int', nullable: true })
  precio: number;

  @Column({ type: 'int', nullable: true })
  descuento: number;

  @Column({ type: 'int', nullable: true })
  totalProducto: number;
}
