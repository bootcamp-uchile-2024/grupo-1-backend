import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ControlPlagas } from './controlplagas-entity';

@Entity()
export class FormaAplicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(
    () => ControlPlagas,
    (controlPlagas) => controlPlagas.formaAplicacion,
  )
  controlPlagas: ControlPlagas[];
}
