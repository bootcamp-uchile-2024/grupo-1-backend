import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { DetalleOrdenCompra } from './detalle_orden_compra.entity';
import { Venta } from './venta.entity';
import { EstadoOrden } from '../enum/estadosOC';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
@Entity('OrdenCompra')
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  emailComprador: string;
  @Column({ type: 'date', nullable: false })
  fechaOrden: Date;
  @Column({ type: 'varchar', length: 100, nullable: false })
  estado: EstadoOrden;
  @Column({ type: 'number', nullable: true })
  idUsuario: number;
  @ManyToOne(() => Usuario, (usuario) => usuario.orden)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
  @OneToMany(() => DetalleOrdenCompra, (detalle) => detalle.orden)
  detallesOrden: DetalleOrdenCompra[];
  @OneToOne(() => Venta, (venta) => venta.ordenCompra)
  venta: Venta;
}
