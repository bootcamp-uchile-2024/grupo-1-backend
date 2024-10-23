/*
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { JardinVirtual } from './jardin_virtual.entity';
import { Planta } from './planta.entity';

@Entity({ name: 'DetalleJardinVirtual' })
export class DetalleJardinVirtual {
  @PrimaryColumn()
  @ManyToOne(() => JardinVirtual)
  @JoinColumn({ name: 'idJardin' })
  jardinVirtual: JardinVirtual;

  @PrimaryColumn()
  @ManyToOne(() => Planta)
  @JoinColumn({ name: 'idPlanta' })
  planta: Planta;

  @Column({ type: 'date' })
  fechaIngreso: Date;
}
*/