import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Planta } from './planta.entity';
import { TipoFertilizante } from './tipo_fertilizante.entity';
import { Producto } from './producto.entity';
import { TipoPlantasRecomendadas } from './tipo_plantas_recomendadas.entity';

@Entity()
export class Fertilizante {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Producto, (producto) => producto.fertilizante)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
  @Column({ type: 'varchar', length: 255, nullable: true })
  composicion: string;
  @ManyToOne(() => TipoFertilizante, (tipo) => tipo.fertilizantesTipo)
  @JoinColumn({ name: 'idEficacia' })
  tipo: TipoFertilizante;
  @Column({ type: 'varchar', length: 255, nullable: true })
  presentacion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  frecuenciaAplicacion: string;

  @Column({ type: 'int', nullable: true })
  peso: number;

  @ManyToMany(() => Planta, (planta) => planta.fertilizantes)
  plantas: Planta[];

  @ManyToMany(() => TipoPlantasRecomendadas, (tipoPlanta) => tipoPlanta.fertilizantes)
  tipoPlantas: TipoPlantasRecomendadas[];
}
