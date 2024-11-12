import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Region } from './region.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Despacho } from 'src/despachos/entities/despacho.entity';

@Entity('Comuna')
export class Comuna {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre: string;

  @ManyToOne(() => Region, (region) => region.comunas)
  @JoinColumn({ name: 'idRegion' })
  region: Region;

  @OneToMany(() => Usuario, (usuario) => usuario.perfil)
  usuarios: Usuario[];

  @OneToMany(() => Despacho, (despacho) => despacho.comuna)
  despachos: Despacho[];
}
