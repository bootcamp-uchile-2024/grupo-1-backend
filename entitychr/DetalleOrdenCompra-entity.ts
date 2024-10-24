import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';
import { OrdenCompra } from './OrdenCompra-entity';

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

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @Column({ type: 'int', nullable: false })
  precio: number;

  @Column({ type: 'int', nullable: true })
  descuento: number;

  @Column({ type: 'int', nullable: false })
  totalProducto: number;
}
