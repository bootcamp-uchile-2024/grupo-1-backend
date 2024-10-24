import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sustrato } from './sustrato-entity';

@Entity()
export class ComposicionSustrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  descripcion: string;

  @OneToMany(() => Sustrato, (sustrato) => sustrato.composicionSustrato)
  sustratos: Sustrato[];
}
