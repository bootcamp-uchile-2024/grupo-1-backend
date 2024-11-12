import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ControlPlaga } from './control_plaga.entity';

@Entity({ name: 'Plaga' })
export class Plaga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @ManyToMany(() => ControlPlaga, (controlplaga) => controlplaga.plagas)
  controlplagas: ControlPlaga[];
}
