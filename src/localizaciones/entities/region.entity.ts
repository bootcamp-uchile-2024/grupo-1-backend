import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comuna } from './comuna.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre: string;

  @OneToMany(() => Comuna, (comuna) => comuna.region)
  comunas: Comuna[];
}
