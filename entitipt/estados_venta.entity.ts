import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'EstadosVenta' })
export class EstadosVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
}
