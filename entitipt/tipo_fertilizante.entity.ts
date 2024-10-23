import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TipoFertilizante' })
export class TipoFertilizante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  descripcion: string;
}
