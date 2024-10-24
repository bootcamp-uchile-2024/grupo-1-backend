import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Fertilizante } from './fertilizante-entity';

@Entity()
export class TipoPlantasRecomendadas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(
    () => Fertilizante,
    (fertilizante) => fertilizante.tipoPlantasRecomendadas,
  )
  fertilizantes: Fertilizante[];
}
