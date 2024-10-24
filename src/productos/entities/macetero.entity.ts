import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,OneToOne } from 'typeorm';
import { Producto } from './producto.entity';
import { FormaMacetero } from './forma_macetero.entity';

@Entity({ name: 'Macetero' })
export class Macetero {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Producto, (producto) => producto.macetero)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  

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


  @ManyToOne(() => FormaMacetero, (formamacetero) => formamacetero.macetero)
  @JoinColumn({ name: 'idForma' })
  formamacetero: FormaMacetero;

 

}
