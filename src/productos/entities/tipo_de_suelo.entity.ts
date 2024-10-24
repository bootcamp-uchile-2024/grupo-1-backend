import { Entity, Column, PrimaryGeneratedColumn,ManyToMany } from 'typeorm';
import { Planta } from './planta.entity';

@Entity({ name: 'TipoDeSuelo' })
export class TipoDeSuelo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;

  @ManyToMany(() => Planta, (planta) => planta.suelos)
  plantas: Planta[];
}
