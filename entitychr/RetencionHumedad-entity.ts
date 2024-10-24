import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sustrato } from './sustrato-entity';

@Entity()
export class RetencionHumedad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(() => Sustrato, (sustrato) => sustrato.retencionHumedad)
  sustratos: Sustrato[];
}
