import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Sustrato } from './sustrato.entity';
@Entity({ name: 'TexturaSustrato' })
export class TexturaSustrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;

  @OneToMany(() => Sustrato, (sustrato) => sustrato.retencionHumedad)
  sustratos: Sustrato[];

  @ManyToMany(() => Sustrato)
  @JoinTable({
    name: 'SustratoTextura',
    joinColumn: {
      name: 'idSustrato',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'idTextura',
      referencedColumnName: 'id',
    },
  })
  sustratosText: Sustrato[];
}
