import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Categoria } from './categoria.entity';
import { Planta } from './planta.entity';
import { Fertilizante } from './fertilizante.entity';
import { Sustrato } from './sustrato.entity';
import { ControlPlaga } from './control_plaga.entity';
import { Macetero } from './macetero.entity';
import { ImagenProducto } from './imagen_producto.entity';
import { DetalleOrdenCompra } from 'src/ventas/entities/detalle_orden_compra.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Entity('Producto')
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

  @OneToOne(() => Fertilizante, (fertilizante) => fertilizante.producto)
  fertilizante: Fertilizante;

  @OneToOne(() => Sustrato, (sustrato) => sustrato.producto)
  sustrato: Sustrato;

  @OneToOne(() => ControlPlaga, (controlplaga) => controlplaga.producto)
  controlplaga: ControlPlaga;

  @OneToOne(() => Macetero, (macetero) => macetero.producto)
  macetero: Macetero;

  @OneToMany(() => ImagenProducto, (imagen) => imagen.producto)
  imagenes: ImagenProducto[];

  @OneToMany(() => DetalleOrdenCompra, (detalleOC) => detalleOC.producto)
  detallesOC: DetalleOrdenCompra[];

  @OneToOne(() => Servicio, (servicio) => servicio.producto)
  servicio: Servicio;
}
