import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto-entity';
import { Habitat } from './habitat-entity';
import { LuzRequerida } from './luzrequerida-entity';
import { NivelDeHumedad } from './niveldehumedad-entity';
import { DificultadDeCuidado } from './dificultaddecuidado-entity';
import { FrecuenciaDeRiego } from './frecuenciaderiego-entity';

@Entity()
export class Planta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombrePlanta: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombreCientifico: string;

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

  @ManyToOne(() => DificultadDeCuidado, (dificultad) => dificultad.plantas)
  @JoinColumn({ name: 'idDificultad' })
  dificultad: DificultadDeCuidado;

  @ManyToOne(() => FrecuenciaDeRiego, (frecuencia) => frecuencia.plantas)
  @JoinColumn({ name: 'idFrecuencia' })
  frecuencia: FrecuenciaDeRiego;

  @OneToOne(() => Producto, (producto) => producto.planta)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
}
