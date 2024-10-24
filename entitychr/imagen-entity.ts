import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';

@Entity()
export class ImagenProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  urlImagen: string;

  @ManyToOne(() => Producto, (producto) => producto.imagenes)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
}
