import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DificultadDeCuidado' })
export class DificultadDeCuidado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
