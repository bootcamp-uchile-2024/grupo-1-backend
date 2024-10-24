import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ServicioUsuario } from './servicio-usuario.entity';

@Entity()
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(
    () => ServicioUsuario,
    (servicioUsuario) => servicioUsuario.servicio,
  )
  servicioUsuarios: ServicioUsuario[];
}
