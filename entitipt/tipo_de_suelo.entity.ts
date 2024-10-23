import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TipoDeSuelo' })
export class TipoDeSuelo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
