import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { RetencionHumedad } from './retencion_humedad.entity';

@Entity({ name: 'Sustrato' })
export class Sustrato {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => RetencionHumedad)
  @JoinColumn({ name: 'idRetencionHumedad' })
  retencionHumedad: RetencionHumedad;

  @Column({ type: 'varchar', length: 255 })
  peso: string;
}
