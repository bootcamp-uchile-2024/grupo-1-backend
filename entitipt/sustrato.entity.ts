import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Planta } from './planta.entity';
import { RetencionHumedad } from './retencion_humedad.entity';

@Entity({ name: 'Sustrato' })
export class Sustrato {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Planta, (planta) => planta.sustratos)
  @JoinColumn({ name: 'idPlanta' })
  planta: Planta;

  @ManyToOne(() => RetencionHumedad, (retencion) => retencion.sustratos)
  @JoinColumn({ name: 'idRetencionHumedad' })
  retencionHumedad: RetencionHumedad;

  @Column({ type: 'varchar', length: 255, nullable: true })
  peso: string;
}
