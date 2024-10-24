import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Producto } from './producto.entity';
import { Eficacia } from './eficacia.entity';
import { FormaAplicacion } from './forma_aplicacion.entity';
import { Plaga } from './plaga.entity';

@Entity({ name: 'ControlPlagas' })
export class ControlPlaga {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Producto, (producto) => producto.controlplaga)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => Eficacia, (eficacia) => eficacia.controlplagas)
  @JoinColumn({ name: 'idEficacia' })
  controlplaga: Eficacia;

  @Column({ type: 'varchar', length: 255 })
  composicion: string;
  @Column({ type: 'varchar', length: 100 })
  duracionProteccion: string;
  @Column({ type: 'int' })
  peso: number;

  @ManyToMany(() => FormaAplicacion)
  @JoinTable({
    name: 'controlplaga_formas_aplicacion',
    joinColumn: {
      name: 'controlPlagaId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'formaAplicacionId',
      referencedColumnName: 'id',
    },
  })
  formasAplicacion: FormaAplicacion[];

  @ManyToMany(() => Plaga)
  @JoinTable({
    name: 'PlagasControladas',
    joinColumn: {
      name: 'idControlPlaga',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'idPlaga',
      referencedColumnName: 'id',
    },
  })
  plagas: Plaga[];
  Eficacia: any;
  formaaplica: any;
}
