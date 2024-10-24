import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EstadosFormaPago } from './estados_forma_pago.entity';

@Entity({ name: 'FormaPago' })
export class FormaPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;

  @ManyToOne(() => EstadosFormaPago)
  @JoinColumn({ name: 'idEstadoFormaPago' })
  estadoFormaPago: EstadosFormaPago;
}
