import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { JardinVirtual } from './jardin_virtual.entity';
import { Planta } from './planta.entity';

@Entity()
export class DetalleJardinVirtual {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JardinVirtual, (jardin) => jardin.detalles)
  @JoinColumn({ name: 'idJardin' })
  jardin: JardinVirtual;

  @ManyToOne(() => Planta, (planta) => planta.detallesJardin)
  @JoinColumn({ name: 'idPlanta' })
  planta: Planta;

  @Column({ type: 'date', nullable: true })
  fechaIngreso: Date;
}
