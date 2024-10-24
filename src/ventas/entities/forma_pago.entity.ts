import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EstadosFormaPago } from './estados_forma_pago.entity';
import { Venta } from './venta.entity';

@Entity({ name: 'FormaPago' })
export class FormaPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
  @ManyToOne(() => EstadosFormaPago, (estadoFormaPago) => estadoFormaPago.formapago)
  @JoinColumn({ name: 'idEstadoVenta' })
  estadoFormaPago: EstadosFormaPago;

  @OneToMany(() => Venta, (venta) => venta.formaPago)
  ventas: Venta[];

 

}
