import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EstadosOC } from './estado_OC.entity';

@Entity({ name: 'OrdenCompra' })
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaOrden: Date;

  @ManyToOne(() => EstadosOC)
  @JoinColumn({ name: 'idEstadoOC' })
  estadoOC: EstadosOC;
}
