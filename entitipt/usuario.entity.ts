import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Perfil } from './perfil.entity';
import { Comuna } from './comuna.entity';
import { ServicioUsuario } from './servicio-usuario.entity';
import { JardinVirtual } from './jardin_virtual.entity';
import { OrdenCompra } from './orden-compra.entity';

@Entity({ name: 'Usuario' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  rutUsuario: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombres: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apellidos: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  clave: string;

  @Column({ type: 'int', nullable: true })
  telefono: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  codigoPostal: string;

  @ManyToOne(() => Perfil, (perfil) => perfil.usuarios)
  @JoinColumn({ name: 'idPerfil' })
  perfil: Perfil;

  @ManyToOne(() => Comuna, (comuna) => comuna.usuarios)
  @JoinColumn({ name: 'idComuna' })
  comuna: Comuna;

  @OneToMany(
    () => ServicioUsuario,
    (servicioUsuario) => servicioUsuario.usuario,
  )
  servicios: ServicioUsuario[];

  @OneToOne(() => JardinVirtual, (jardinVirtual) => jardinVirtual.usuario)
  jardinVirtual: JardinVirtual;

  @OneToMany(() => OrdenCompra, (ordenCompra) => ordenCompra.usuario)
  ordenesCompra: OrdenCompra[];
}
