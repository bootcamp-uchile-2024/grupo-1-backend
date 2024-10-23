import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from './categoria.entity';

@Entity({ name: 'Producto' })
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombreProducto: string;

  @Column({ type: 'int' })
  descuento: number;

  @Column({ type: 'int' })
  precioNormal: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar', length: 255 })
  descripcionProducto: string;

  @Column({ type: 'int' })
  valoracion: number;

  @Column({ type: 'int' })
  cantidadVentas: number;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'idCategoria' })
  categoria: Categoria;
}
