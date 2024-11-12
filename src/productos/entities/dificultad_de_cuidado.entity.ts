import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Planta } from './planta.entity';

@Entity({ name: 'DificultadDeCuidado' })
export class DificultadDeCuidado {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  descripcion: string;
  @OneToMany(() => Planta, (planta) => planta.dificultad)
  plantas: Planta[];
}
