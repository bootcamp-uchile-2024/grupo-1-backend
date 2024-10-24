import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';
import { FormaMacetero } from './formamacetero-entity';

@Entity()
export class Macetero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreMacetero: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  material: string;

  @Column({ type: 'int', nullable: true })
  tamano: number;

  @ManyToOne(() => FormaMacetero, (forma) => forma.maceteros)
  @JoinColumn({ name: 'idFormaMacetero' })
  formaMacetero: FormaMacetero;

  @OneToOne(() => Producto, (producto) => producto.macetero)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
}
