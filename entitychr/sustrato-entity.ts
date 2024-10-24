import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';
import { RetencionHumedad } from './retencionhumedad-entity';
import { ComposicionSustrato } from './composicionsustrato-entity';
import { TexturaSustrato } from './texturasustrato-entity';

@Entity()
export class Sustrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreSustrato: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @ManyToOne(() => RetencionHumedad, (retencion) => retencion.sustratos)
  @JoinColumn({ name: 'idRetencionHumedad' })
  retencionHumedad: RetencionHumedad;

  @ManyToOne(() => ComposicionSustrato, (composicion) => composicion.sustratos)
  @JoinColumn({ name: 'idComposicionSustrato' })
  composicionSustrato: ComposicionSustrato;

  @ManyToOne(() => TexturaSustrato, (textura) => textura.sustratos)
  @JoinColumn({ name: 'idTexturaSustrato' })
  texturaSustrato: TexturaSustrato;

  @OneToOne(() => Producto, (producto) => producto.sustrato)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
}
