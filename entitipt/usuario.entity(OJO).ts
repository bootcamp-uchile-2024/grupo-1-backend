/*
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Perfil } from './perfil.entity';
import { Comuna } from './comuna.entity';

@Entity({ name: 'Usuario' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Perfil)
  @JoinColumn({ name: 'idPerfil' })
  perfil: Perfil;

  @Column({ type: 'varchar', length: 10 })
  rutUsuario: string;

  @Column({ type: 'varchar', length: 255 })
  nombres: string;

  @Column({ type: 'varchar', length: 255 })
  apellidos: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 10 })
  clave: string;

  @Column({ type: 'int' })
  telefono: number;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @ManyToOne(() => Comuna)
  @JoinColumn({ name: 'idComuna' })
  comuna: Comuna;

  @Column({ type: 'varchar', length: 255 })
  codigoPostal: string;
}
*/