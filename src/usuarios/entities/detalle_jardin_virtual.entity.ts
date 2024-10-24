import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { JardinVirtual } from './jardin_virtual.entity';
import { Planta } from 'src/productos/entities/planta.entity';

@Entity()
export class DetalleJardinVirtual {
  @PrimaryColumn()
  idJardin: number;

  @PrimaryColumn()
  idPlanta: number;

  @ManyToOne(() => JardinVirtual, (jardin) => jardin.detalle)
  @JoinColumn({ name: 'idJardin' })
  jardin: JardinVirtual;

  @ManyToOne(() => Planta, (planta) => planta.detallesJardin)
  @JoinColumn({ name: 'idPlanta' })
  planta: Planta;

  @Column({ type: 'date', nullable: true })
  fechaIngreso: Date;
}
