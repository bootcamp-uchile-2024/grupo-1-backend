import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ControlPlagas } from './controlplagas-entity';

@Entity()
export class Eficacia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(() => ControlPlagas, (controlPlagas) => controlPlagas.eficacia)
  controlPlagas: ControlPlagas[];
}
