import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EstadosOC } from './estado_OC.entity';
import { DetalleOrdenCompra } from './detalle_orden_compra.entity';
import { Venta } from './venta.entity';

@Entity()
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  fechaOrden: Date;

  @ManyToOne(() => EstadosOC, (estado) => estado.ordenesCompra)
  @JoinColumn({ name: 'idEstadoOC' })
  estado: EstadosOC;
  @OneToMany(() => DetalleOrdenCompra, (detalle) => detalle.orden)
  detallesOrden: DetalleOrdenCompra[];
 
  @OneToOne(() => Venta, (venta) => venta.ordenCompra)
  venta: Venta;
}
