import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sustrato } from './sustrato.entity';

@Entity({ name: 'RetencionHumedad' })
export class RetencionHumedad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  descripcion: string;

  @OneToMany(() => Sustrato, (sustrato) => sustrato.retencionHumedad)
  sustratos: Sustrato[];
}
