import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Venta } from './venta.entity';

@Entity({ name: 'EstadosVenta' })
export class EstadosVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
  @OneToMany(() => Venta, (venta) => venta.estadoVenta)
  ventas: Venta[];
}
