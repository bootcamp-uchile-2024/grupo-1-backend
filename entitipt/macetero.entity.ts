import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { FormaMacetero } from './forma_macetero.entity';

@Entity({ name: 'Macetero' })
export class Macetero {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => FormaMacetero)
  @JoinColumn({ name: 'idForma' })
  forma: FormaMacetero;

  @Column({ type: 'varchar', length: 100 })
  material: string;

  @Column({ type: 'int' })
  altura: number;

  @Column({ type: 'int' })
  ancho: number;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @Column({ type: 'int' })
  peso: number;
}
