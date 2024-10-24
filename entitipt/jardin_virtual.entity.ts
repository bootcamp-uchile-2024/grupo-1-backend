import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { DetalleJardinVirtual } from './detalle_jardin_virtual.entity';

@Entity()
export class JardinVirtual {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, (usuario) => usuario.jardinVirtual)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @OneToMany(() => DetalleJardinVirtual, (detalle) => detalle.jardin)
  detalles: DetalleJardinVirtual[];
}
