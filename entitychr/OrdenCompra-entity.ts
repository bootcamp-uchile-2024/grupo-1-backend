import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetalleOrdenCompra } from './DetalleOrdenCompra-entity';

@Entity()
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  numeroOrden: string;

  @Column({ type: 'date', nullable: false })
  fechaOrden: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  estado: string;

  @OneToMany(() => DetalleOrdenCompra, (detalle) => detalle.orden)
  detalles: DetalleOrdenCompra[];
}
