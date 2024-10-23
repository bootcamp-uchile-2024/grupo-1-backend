import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'EstadosFormaPago' })
export class EstadosFormaPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
}
