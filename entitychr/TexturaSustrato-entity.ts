import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sustrato } from './sustrato-entity';

@Entity()
export class TexturaSustrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(() => Sustrato, (sustrato) => sustrato.texturaSustrato)
  sustratos: Sustrato[];
}
