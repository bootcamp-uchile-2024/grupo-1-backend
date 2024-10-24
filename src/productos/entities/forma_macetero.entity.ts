import { Entity, Column, PrimaryGeneratedColumn , OneToMany} from 'typeorm';
import { Macetero } from './macetero.entity';

@Entity({ name: 'FormaMacetero' })
export class FormaMacetero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  descripcion: string;
  
  @OneToMany(() => Macetero, (macetero) => macetero.forma)
  maceteros: Macetero[];
}
