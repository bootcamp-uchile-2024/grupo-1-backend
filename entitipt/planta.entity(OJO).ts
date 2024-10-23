/*
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { Habitat } from './habitat.entity';
import { LuzRequerida } from './luzRequerida.entity';
import { NivelDeHumedad } from './nivelDeHumedad.entity';
import { DificultadDeCuidado } from './dificultadDeCuidado.entity';
import { FrecuenciaDeRiego } from './frecuenciaDeRiego.entity';

@Entity({ name: 'Planta' })
export class Planta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column({ type: 'varchar', length: 255 })
  nombrePlanta: string;

  @Column({ type: 'varchar', length: 255 })
  nombreCientifico: string;

  @ManyToOne(() => Habitat)
  @JoinColumn({ name: 'idHabitat' })
  habitat: Habitat;

  @ManyToOne(() => LuzRequerida)
  @JoinColumn({ name: 'idLuz' })
  luz: LuzRequerida;

  @ManyToOne(() => NivelDeHumedad)
  @JoinColumn({ name: 'idHumedad' })
  humedad: NivelDeHumedad;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  temperaturaIdeal: number;

  @Column({ type: 'int' })
  toxicidadMascotas: number;

  @Column({ type: 'int' })
  tamanoMaximo: number;

  @Column({ type: 'int' })
  peso: number;

  @ManyToOne(() => DificultadDeCuidado)
  @JoinColumn({ name: 'idDificultad' })
  dificultad: DificultadDeCuidado;

  @ManyToOne(() => FrecuenciaDeRiego)
  @JoinColumn({ name: 'idFrecuencia' })
  frecuencia: FrecuenciaDeRiego;
}

*/
