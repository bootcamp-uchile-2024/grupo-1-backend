/*
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EstadosFormaPago } from './estadosFormaPago.entity';

@Entity({ name: 'FormaPago' })
export class FormaPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @ManyToOne(() => EstadosFormaPago)
  @JoinColumn({ name: 'idEstadoFormaPago' })
  estadoFormaPago: EstadosFormaPago;
}*/
