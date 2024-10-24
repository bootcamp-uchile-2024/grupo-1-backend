import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Region } from './region.entity';
import { Usuario } from './usuario.entity';

@Entity()
export class Comuna {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre: string;

  @ManyToOne(() => Region, (region) => region.comunas)
  @JoinColumn({ name: 'idRegion' })
  region: Region;

  @OneToMany(() => Usuario, (usuario) => usuario.comuna)
  usuarios: Usuario[];
}
