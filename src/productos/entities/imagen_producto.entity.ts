import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto.entity';

@Entity({ name: 'ImagenProducto' })
export class ImagenProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto, (producto) => producto.imagenes)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column({ type: 'longtext'})
  urlImagen: string;
}
