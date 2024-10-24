import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Fertilizante } from './fertilizante-entity';

@Entity()
export class TipoFertilizante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  descripcion: string;

  @OneToMany(
    () => Fertilizante,
    (fertilizante) => fertilizante.tipoFertilizante,
  )
  fertilizantes: Fertilizante[];
}
