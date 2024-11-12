import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Planta } from './planta.entity';

@Entity('Habitat')
export class Habitat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  descripcion: string;

  @OneToMany(() => Planta, (planta) => planta.habitat)
  plantas: Planta[];
}
