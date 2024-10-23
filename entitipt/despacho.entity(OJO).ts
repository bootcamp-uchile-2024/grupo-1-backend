/*import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity(OJO)';
import { Comuna } from './comuna.entity';
import { TipoDespacho } from './tipo_despacho.entity';

@Entity({ name: 'Despacho' })
export class Despacho {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Venta)
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

  @ManyToOne(() => TipoDespacho)
  @JoinColumn({ name: 'idTipoDespacho' })
  tipoDespacho: TipoDespacho;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @ManyToOne(() => Comuna)
  @JoinColumn({ name: 'idComuna' })
  comuna: Comuna;
}
*/