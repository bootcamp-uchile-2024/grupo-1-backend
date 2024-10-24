import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Producto } from './producto.entity';
import { Habitat } from './habitat.entity';
import { LuzRequerida } from './luz_requerida.entity';
import { NivelDeHumedad } from './nivel_de_humedad.entity';
import { DificultadDeCuidado } from './dificultad_de_cuidado.entity';
import { FrecuenciaDeRiego } from './frecuencia_de_riego.entity';
import { DetalleJardinVirtual } from './detalle_jardin_virtual.entity';
import { Sustrato } from './sustrato.entity';
import { Fertilizante } from './fertilizante.entity';

@Entity()
export class Planta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombrePlanta: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombreCientifico: string;

  @OneToOne(() => Producto, (producto) => producto.planta)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => Habitat, (habitat) => habitat.plantas)
  @JoinColumn({ name: 'idHabitat' })
  habitat: Habitat;

  @ManyToOne(() => LuzRequerida, (luz) => luz.plantas)
  @JoinColumn({ name: 'idLuz' })
  luz: LuzRequerida;

  @ManyToOne(() => NivelDeHumedad, (humedad) => humedad.plantas)
  @JoinColumn({ name: 'idHumedad' })
  humedad: NivelDeHumedad;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  temperaturaIdeal: number;

  @Column({ type: 'int', nullable: true })
  toxicidadMascotas: number;

  @Column({ type: 'int', nullable: true })
  tamanoMaximo: number;

  @Column({ type: 'int', nullable: true })
  peso: number;

  @ManyToOne(() => DificultadDeCuidado, (dificultad) => dificultad.plantas)
  @JoinColumn({ name: 'idDificultad' })
  dificultad: DificultadDeCuidado;

  @ManyToOne(() => FrecuenciaDeRiego, (frecuencia) => frecuencia.plantas)
  @JoinColumn({ name: 'idFrecuencia' })
  frecuencia: FrecuenciaDeRiego;

  @OneToMany(() => DetalleJardinVirtual, (detalle) => detalle.planta)
  detallesJardin: DetalleJardinVirtual[];

  @OneToMany(() => Sustrato, (sustrato) => sustrato.planta)
  sustratos: Sustrato[];

  @OneToMany(() => Fertilizante, (fertilizante) => fertilizante.planta)
  fertilizantes: Fertilizante[];
}
