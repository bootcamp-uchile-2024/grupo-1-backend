import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';
import { Comuna } from './comuna-entity';

@Entity()
export class CoberturaDespachoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto, (producto) => producto.coberturas)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => Comuna, (comuna) => comuna.coberturas)
  @JoinColumn({ name: 'idComuna' })
  comuna: Comuna;
}
