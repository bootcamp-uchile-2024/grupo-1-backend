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
import { Producto } from './producto.entity';
import { TipoFertilizante } from './tipo_fertilizante.entity';
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

  @ManyToOne(() => TipoFertilizante, (tipo) => tipo.fertilizantes)
  @JoinColumn({ name: 'idTipoFertilizante' })
  tipo: TipoFertilizante;

  @Column({ type: 'varchar', length: 255, nullable: true })
  presentacion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  frecuenciaAplicacion: string;

  @Column({ type: 'int', nullable: true })
  peso: number;

  @ManyToMany(
    () => TipoPlantasRecomendadas,
    (tipoPlanta) => tipoPlanta.fertilizantes,
  )
  @JoinTable({
    name: 'FertilizanteTipoPlantas',
    joinColumn: { name: 'idFertilizante', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idTipoPlanta', referencedColumnName: 'id' },
  })
  tipoPlantas: TipoPlantasRecomendadas[];
}
