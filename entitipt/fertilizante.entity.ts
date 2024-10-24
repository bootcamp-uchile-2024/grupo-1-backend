import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Planta } from './planta.entity';
import { TipoFertilizante } from './tipo_fertilizante.entity';
import { Producto } from './producto.entity';

@Entity()
export class Fertilizante {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Planta, (planta) => planta.fertilizantes)
  @JoinColumn({ name: 'idPlanta' })
  planta: Planta;

  @ManyToOne(() => TipoFertilizante, (tipo) => tipo.fertilizantes)
  @JoinColumn({ name: 'idTipoFertilizante' })
  tipoFertilizante: TipoFertilizante;

  @ManyToOne(() => Producto, (producto) => producto.fertilizante)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column({ type: 'varchar', length: 255, nullable: true })
  composicion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  presentacion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  frecuenciaAplicacion: string;

  @Column({ type: 'int', nullable: true })
  peso: number;
}
