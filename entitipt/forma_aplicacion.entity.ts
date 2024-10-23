import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FormaAplicacion' })
export class FormaAplicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
}
