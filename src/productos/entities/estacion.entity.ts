import { Entity, Column, PrimaryGeneratedColumn,OneToMany,ManyToMany } from 'typeorm';
import { Planta } from './planta.entity';

@Entity({ name: 'Estacion' })
export class Estacion {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
  @ManyToMany(() => Planta, (planta) => planta.estaciones)
  plantas: Planta[];
}
