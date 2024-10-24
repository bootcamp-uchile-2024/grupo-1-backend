import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { OrdenCompra } from './orden_compra.entity';

@Entity()
export class DetalleOrdenCompra {
  @PrimaryColumn()
  idOrdenCompra: number;

  @PrimaryColumn()
  idProducto: number;

  @ManyToOne(() => OrdenCompra, (orden) => orden.detallesOrden)
  @JoinColumn({ name: 'idOrdenCompra' })
  orden: OrdenCompra;

  @ManyToOne(() => Producto, (producto) => producto.detallesOC)
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
