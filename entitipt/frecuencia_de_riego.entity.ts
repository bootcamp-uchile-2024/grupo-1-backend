import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FrecuenciaDeRiego' })
export class FrecuenciaDeRiego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
