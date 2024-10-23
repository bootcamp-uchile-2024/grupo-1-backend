import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { TipoFertilizante } from './tipo_fertilizante.entity';

@Entity({ name: 'Fertilizante' })
export class Fertilizante {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => TipoFertilizante)
  @JoinColumn({ name: 'idTipoFertilizante' })
  tipoFertilizante: TipoFertilizante;

  @Column({ type: 'varchar', length: 255 })
  composicion: string;

  @Column({ type: 'varchar', length: 255 })
  presentacion: string;

  @Column({ type: 'varchar', length: 100 })
  frecuenciaAplicacion: string;

  @Column({ type: 'int' })
  peso: number;
}
