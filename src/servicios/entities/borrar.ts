import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Servicio } from './servicio.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity()
export class ServicioUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Servicio, (servicio) => servicio.servicioUsuarios)
  @JoinColumn({ name: 'idServicio' })
  servicio: Servicio;

  @ManyToOne(() => Usuario, (usuario) => usuario.servicios)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
