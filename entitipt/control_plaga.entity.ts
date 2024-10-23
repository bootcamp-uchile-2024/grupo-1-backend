import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { Eficacia } from './eficacia.entity';

@Entity({ name: 'ControlPlaga' })
export class ControlPlaga {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => Eficacia)
  @JoinColumn({ name: 'idEficacia' })
  eficacia: Eficacia;

  @Column({ type: 'varchar', length: 255 })
  composicion: string;

  @Column({ type: 'varchar', length: 100 })
  duracionProteccion: string;

  @Column({ type: 'int' })
  peso: number;
}
