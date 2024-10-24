import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';
import { Eficacia } from './eficacia-entity';
import { Plaga } from './plaga-entity';
import { FormaAplicacion } from './formaaplicacion-entity';

@Entity()
export class ControlPlagas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreProducto: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ingredientesActivos: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  modoAccion: string;

  @ManyToOne(() => Eficacia, (eficacia) => eficacia.controlPlagas)
  @JoinColumn({ name: 'idEficacia' })
  eficacia: Eficacia;

  @ManyToOne(() => Plaga, (plaga) => plaga.controlPlagas)
  @JoinColumn({ name: 'idPlaga' })
  plaga: Plaga;

  @ManyToOne(
    () => FormaAplicacion,
    (formaAplicacion) => formaAplicacion.controlPlagas,
  )
  @JoinColumn({ name: 'idFormaAplicacion' })
  formaAplicacion: FormaAplicacion;

  @OneToOne(() => Producto, (producto) => producto.controlPlagas)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
}
