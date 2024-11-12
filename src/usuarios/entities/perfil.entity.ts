import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('Perfil')
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'boolean', nullable: true })
  accesoSistema: boolean;

  @OneToMany(() => Usuario, (usuarios) => usuarios.perfil)
  usuarios: Usuario[];
}
