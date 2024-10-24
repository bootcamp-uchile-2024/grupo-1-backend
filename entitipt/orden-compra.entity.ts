import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { DetalleOrdenCompra } from './detalle_orden_compra.entity';
import { EstadosOC } from './estado_OC.entity';

@Entity()
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  fechaOrden: Date;

  @ManyToOne(() => EstadosOC, (estado) => estado.ordenesCompra)
  @JoinColumn({ name: 'idEstadoOC' })
  estado: EstadosOC;

  @ManyToOne(() => Usuario, (usuario) => usuario.ordenesCompra)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @OneToMany(() => DetalleOrdenCompra, (detalle) => detalle.orden)
  detalles: DetalleOrdenCompra[];
}
