import { Entity, Column, PrimaryGeneratedColumn, 
  ManyToOne, JoinColumn, OneToOne, } from 'typeorm';

import { Comuna } from 'src/localizaciones/entities/comuna.entity';
import { TipoDespacho } from './tipo_despacho.entity';
import { Venta } from 'src/ventas/entities/venta.entity';

@Entity({ name: 'Despacho' })
export class Despacho {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Venta, (idVenta) => idVenta.despacho)
  @JoinColumn({ name: 'idVenta' })
  venta: Venta;

  @Column({ type: 'date' })
  fechaDespacho: Date;

  @Column({ type: 'date' })
  fechaLlegada: Date;

  @Column({ type: 'varchar', length: 10 })
  rutReceptor: string;

  @Column({ type: 'varchar', length: 255 })
  nombreReceptor: string;

  @Column({ type: 'varchar', length: 50 })
  estado: string;

  @ManyToOne(() => TipoDespacho, (tipoDespacho) => tipoDespacho.despachos)
  @JoinColumn({ name: 'idTipoDespacho' })
  tipoDespacho: TipoDespacho;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

 
  @ManyToOne(() => Comuna, (comuna) => comuna.despachos)
  @JoinColumn({ name: 'idComuna' })
  comuna: Comuna;
}
