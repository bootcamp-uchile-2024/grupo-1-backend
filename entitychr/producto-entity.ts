import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Categoria } from './categoria-entity';
import { Planta } from './planta-entity';
import { ControlPlagas } from './controlplagas-entity';
import { Sustrato } from './sustrato-entity';
import { Fertilizante } from './fertilizante-entity';
import { Macetero } from './macetero-entity';
import { Servicio } from './servicio-entity';
import { CoberturaDespachoProducto } from './CoberturaDespachoProducto-entity';
import { ImagenProducto } from './imagen-entity';
import { DetalleOrdenCompra } from './DetalleOrdenCompra-entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreProducto: string;

  @Column({ type: 'int', nullable: true })
  descuento: number;

  @Column({ type: 'int', nullable: false })
  precioNormal: number;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcionProducto: string;

  @Column({ type: 'int', nullable: true })
  valoracion: number;

  @Column({ type: 'int', nullable: true })
  cantidadVentas: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'idCategoria' })
  categoria: Categoria;

  @OneToOne(() => Planta, (planta) => planta.producto)
  planta: Planta;

  @OneToOne(() => ControlPlagas, (controlPlagas) => controlPlagas.producto)
  controlPlagas: ControlPlagas;

  @OneToOne(() => Sustrato, (sustrato) => sustrato.producto)
  sustrato: Sustrato;

  @OneToOne(() => Fertilizante, (fertilizante) => fertilizante.producto)
  fertilizante: Fertilizante;

  @OneToOne(() => Macetero, (macetero) => macetero.producto)
  macetero: Macetero;

  @OneToOne(() => Servicio, (servicio) => servicio.producto)
  servicio: Servicio;

  @OneToMany(() => CoberturaDespachoProducto, (cobertura) => cobertura.producto)
  coberturas: CoberturaDespachoProducto[];

  @OneToMany(() => ImagenProducto, (imagen) => imagen.producto)
  imagenes: ImagenProducto[];

  @OneToMany(() => DetalleOrdenCompra, (detalle) => detalle.producto)
  detallesOrdenCompra: DetalleOrdenCompra[];
}
