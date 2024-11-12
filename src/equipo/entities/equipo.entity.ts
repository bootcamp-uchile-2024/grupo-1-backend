
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipos')  // Nombre de la tabla en la base de datos
export class Equipo {
  
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 100 })
  public nombreArea: string;

  @Column({ type: 'varchar', length: 100 })
  public jefe: string;

  @Column("simple-array")
  public miembros: string[];

  constructor(nombreArea: string, jefe: string, miembros: string[]) {
    this.nombreArea = nombreArea;
    this.jefe = jefe;
    this.miembros = miembros;
  }
}
