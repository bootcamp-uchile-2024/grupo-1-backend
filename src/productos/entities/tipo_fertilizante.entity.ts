import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Fertilizante } from './fertilizante.entity';

@Entity({ name: 'TipoFertilizante' })
export class TipoFertilizante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  descripcion: string;

  @OneToMany(() => Fertilizante, (fertilizante) => fertilizante.tipo)
  fertilizantes: Fertilizante[];
}
