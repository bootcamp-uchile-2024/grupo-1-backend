import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FormaPago } from './forma_pago.entity';
@Entity({ name: 'EstadosFormaPago' })
export class EstadosFormaPago {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
  @OneToMany(() => FormaPago, (formaPago) => formaPago.estadoFormaPago)
  formasPago: FormaPago[];
}
