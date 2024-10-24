import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';
import { TipoFertilizante } from './TipoFertilizante-entity';
import { TipoPlantasRecomendadas } from './TipoPlantasRecomendadas-entity';

@Entity()
export class Fertilizante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreFertilizante: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  composicion: string;

  @ManyToOne(() => TipoFertilizante, (tipo) => tipo.fertilizantes)
  @JoinColumn({ name: 'idTipoFertilizante' })
  tipoFertilizante: TipoFertilizante;

  @ManyToOne(() => TipoPlantasRecomendadas, (tipo) => tipo.fertilizantes)
  @JoinColumn({ name: 'idTipoPlantasRecomendadas' })
  tipoPlantasRecomendadas: TipoPlantasRecomendadas;

  @OneToOne(() => Producto, (producto) => producto.fertilizante)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
}
