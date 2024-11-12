import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Perfil } from './perfil.entity';
import { Comuna } from 'src/localizaciones/entities/comuna.entity';
import { JardinVirtual } from './jardin_virtual.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { OrdenCompra } from 'src/ventas/entities/orden_compra.entity';

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
  @ManyToOne(() => Comuna, (comuna) => comuna.usuarios)
  @JoinColumn({ name: 'idComuna' })
  comuna: Comuna;

  @Column({ type: 'varchar', length: 255, nullable: true })
  codigoPostal: string;
  @ManyToOne(() => Perfil, (perfil) => perfil.usuarios)
  @JoinColumn({ name: 'idPerfil' })
  perfil: Perfil;

  @OneToOne(() => JardinVirtual, (jardin) => jardin.usuario)
  jardin: JardinVirtual;

  @ManyToMany(() => Servicio, (servicio) => servicio.usuarios)
  servicios: Servicio[];
  jardinVirtual: any;

  @OneToMany(() => OrdenCompra, (orden) => orden.usuario)
  orden: OrdenCompra[];
}
