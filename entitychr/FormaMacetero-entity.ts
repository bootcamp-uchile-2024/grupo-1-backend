import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Macetero } from './macetero-entity';

@Entity()
export class FormaMacetero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(() => Macetero, (macetero) => macetero.formaMacetero)
  maceteros: Macetero[];
}
