import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';

@Entity()
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreServicio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'int', nullable: false })
  precio: number;

  @OneToOne(() => Producto, (producto) => producto.servicio)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
}
