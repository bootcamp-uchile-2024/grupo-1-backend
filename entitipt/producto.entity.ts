import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Categoria } from './categoria.entity';
import { Planta } from './planta.entity';
import { Fertilizante } from './fertilizante.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreProducto: string;

  @Column({ type: 'int', nullable: true })
  descuento: number;

  @Column({ type: 'int', nullable: false })
  precioNormal: number;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcionProducto: string;

  @Column({ type: 'int', nullable: true })
  valoracion: number;

  @Column({ type: 'int', nullable: true })
  cantidadVentas: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'idCategoria' })
  categoria: Categoria;

  @OneToOne(() => Planta, (planta) => planta.producto)
  planta: Planta;
  detallesOrdenCompra: any;

  @OneToOne(() => Fertilizante, (fertilizante) => fertilizante.producto)
  @JoinColumn({ name: 'idFertilizante' })
  fertilizante: Fertilizante;
}
