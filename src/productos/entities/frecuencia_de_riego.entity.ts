import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Planta } from './planta.entity';

@Entity({ name: 'FrecuenciaDeRiego' })
export class FrecuenciaDeRiego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  descripcion: string;

  @OneToMany(() => Planta, (planta) => planta.frecuencia)
  plantas: Planta[];
}
