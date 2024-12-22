import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

export enum NombrePerfil {
  ADMIN = 'ADMIN',
  USER = 'USUARIO',
  GUEST = 'INVITADO',
}

@Entity('Perfil')
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: NombrePerfil, nullable: true })
  nombrePerfil: NombrePerfil;

  @Column({ type: 'boolean', nullable: true })
  accesoSistema: boolean;

  @OneToMany(() => Usuario, (usuarios) => usuarios.perfil)
  usuarios: Usuario[];
}
