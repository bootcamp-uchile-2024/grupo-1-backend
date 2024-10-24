import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { Planta } from './planta.entity';
import { RetencionHumedad } from './retencion_humedad.entity';
import { Producto } from './producto.entity';
import { TexturaSustrato } from './textura_sustrato.entity';

@Entity({ name: 'Sustrato' })
export class Sustrato {
  @PrimaryGeneratedColumn()
  id: number;
 
  @OneToOne(() => Producto, (producto) => producto.sustrato)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
 
  @ManyToOne(() => RetencionHumedad, (retencion) => retencion.sustrato)
  @JoinColumn({ name: 'idRetencionHumedad' })
  retencionHumedad: RetencionHumedad;

  @Column({ type: 'varchar', length: 255, nullable: true })
  peso: string;

  @ManyToMany(() => Planta, (planta) => planta.sustratos)
  plantas: Planta[];

  @ManyToMany(() => TexturaSustrato, (textura) => textura.sustratosText)
  texturas: TexturaSustrato[];
 
}
