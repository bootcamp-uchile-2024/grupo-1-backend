import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { ControlPlaga } from './control_plaga.entity';

@Entity({ name: 'Eficacia' })
export class Eficacia {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @OneToMany(() => ControlPlaga, (controlplaga) => controlplaga.eficacia)
  controlplagas: ControlPlaga[];
}
