import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Estacion' })
export class Estacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
